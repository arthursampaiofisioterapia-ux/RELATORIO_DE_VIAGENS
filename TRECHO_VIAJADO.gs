/*************************************************
 * CONFIGURAÇÕES DO TRECHO VIAJADO
 *************************************************/
var CONFIG_TRECHO = {
  CABECALHOS_DATA_POSSIVEIS: [
    'DATA CRIAÇÃO PROCESSO',
    'Data criação processo',
    'Data criacao processo',
    'Data de criação processo',
    'Data de criacao processo'
  ],
  CABECALHOS_CIDADE_POSSIVEIS: ['Cidade', 'Município', 'Municipio', 'Local']
};

/*************************************************
 * MONTA O TRECHO VIAJADO COM DATA DE IDA/RETORNO
 * - Exemplo de saída:
 *   Dia 10/02: Belo Horizonte > Itabira
 *   Dia 11/02: Itabira > Coronel Fabriciano
 *************************************************/
function montarTrechoViajadoComDatas_(cabecalhos, linhas) {
  var idxData = encontrarIndiceColuna_(cabecalhos, CONFIG_TRECHO.CABECALHOS_DATA_POSSIVEIS);
  if (idxData === -1) {
    throw new Error('Coluna de data não encontrada para montar o trecho viajado.');
  }

  var idxCidade = encontrarIndiceColuna_(cabecalhos, CONFIG_TRECHO.CABECALHOS_CIDADE_POSSIVEIS);
  if (idxCidade === -1) {
    throw new Error('Coluna de cidade não encontrada para montar o trecho viajado.');
  }

  var ordemDatas = [];
  var rotasPorData = {};

  for (var i = 0; i < linhas.length; i++) {
    var linha = linhas[i];
    var data = parseDataBRouDate_(linha[idxData]);
    var cidadeBruta = linha[idxCidade];

    if (!data || cidadeBruta === '' || cidadeBruta === null || cidadeBruta === undefined) {
      continue;
    }

    var chaveData = formatarDataBR_(data); // dd/MM/yyyy
    var cidade = formatarCidade_(cidadeBruta);
    var chaveCidade = normalizarChave_(cidade);

    if (!rotasPorData[chaveData]) {
      rotasPorData[chaveData] = {
        cidades: [],
        chaves: []
      };
      ordemDatas.push(chaveData);
    }

    var rota = rotasPorData[chaveData];
    var ultimaChave = rota.chaves.length ? rota.chaves[rota.chaves.length - 1] : '';

    // Remove repetição consecutiva (BH > BH > Contagem vira BH > Contagem)
    if (ultimaChave !== chaveCidade) {
      rota.chaves.push(chaveCidade);
      rota.cidades.push(cidade);
    }
  }

  if (!ordemDatas.length) {
    return '';
  }

  var linhasTrecho = [];
  for (var j = 0; j < ordemDatas.length; j++) {
    var dataCompleta = ordemDatas[j];
    var rotaDoDia = rotasPorData[dataCompleta].cidades;
    var diaMes = extrairDiaMes_(dataCompleta);

    linhasTrecho.push('Dia ' + diaMes + ': ' + rotaDoDia.join(' > '));
  }

  return linhasTrecho.join('\n');
}

/*************************************************
 * EXTRAI dd/MM DE UMA STRING dd/MM/yyyy
 *************************************************/
function extrairDiaMes_(dataCompleta) {
  var match = String(dataCompleta || '').match(/^(\d{2}\/\d{2})\/\d{4}$/);
  return match ? match[1] : dataCompleta;
}
