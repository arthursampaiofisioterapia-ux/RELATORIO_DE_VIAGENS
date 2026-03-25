/*************************************************
 * CONFIGURAÇÕES DA DESCRIÇÃO DE ATIVIDADES
 *************************************************/
var CONFIG_DESCRICAO = {
  CABECALHOS_DATA_POSSIVEIS: [
    'DATA CRIAÇÃO PROCESSO',
    'Data criação processo',
    'Data criacao processo',
    'Data de criação processo',
    'Data de criacao processo'
  ],
  CABECALHOS_PROCESSO_POSSIVEIS: ['Número processo', 'Numero processo', 'Nº processo', 'N° processo']
};

/*************************************************
 * MONTA A DESCRIÇÃO DAS ATIVIDADES ({2})
 * Formato:
 * Dia 12 de Fevereiro de 2026:
 *
 * Auto de constatação n° 00421/2026
 * Auto de constatação n° 00416/2026
 *************************************************/
function montarDescricaoAtividades_(cabecalhos, linhas) {
  var idxData = encontrarIndiceColuna_(cabecalhos, CONFIG_DESCRICAO.CABECALHOS_DATA_POSSIVEIS);
  if (idxData === -1) {
    throw new Error('Coluna de data não encontrada para montar a descrição de atividades.');
  }

  var idxProcesso = encontrarIndiceColuna_(cabecalhos, CONFIG_DESCRICAO.CABECALHOS_PROCESSO_POSSIVEIS);
  if (idxProcesso === -1) {
    throw new Error('Coluna "Número processo" não encontrada para montar a descrição de atividades.');
  }

  var ordemDatas = [];
  var autosPorData = {};

  for (var i = 0; i < linhas.length; i++) {
    var linha = linhas[i];
    var data = parseDataBRouDate_(linha[idxData]);
    var numeroProcesso = String(linha[idxProcesso] || '').trim();

    if (!data || !numeroProcesso) {
      continue;
    }

    var chaveData = formatarDataBR_(data); // dd/MM/yyyy

    if (!autosPorData[chaveData]) {
      autosPorData[chaveData] = {
        ordem: [],
        vistos: {}
      };
      ordemDatas.push(chaveData);
    }

    // não repetir autos no mesmo dia
    if (!autosPorData[chaveData].vistos[numeroProcesso]) {
      autosPorData[chaveData].vistos[numeroProcesso] = true;
      autosPorData[chaveData].ordem.push(numeroProcesso);
    }
  }

  if (!ordemDatas.length) {
    return '';
  }

  var blocos = [];

  for (var j = 0; j < ordemDatas.length; j++) {
    var dataDia = ordemDatas[j];
    var dataExtenso = formatarDataExtensoPTBR_(dataDia);
    var autosDoDia = autosPorData[dataDia].ordem;

    var linhasDoDia = [];
    linhasDoDia.push('Dia ' + dataExtenso + ':');
    linhasDoDia.push('');

    for (var k = 0; k < autosDoDia.length; k++) {
      linhasDoDia.push('Auto de constatação n° ' + autosDoDia[k]);
    }

    blocos.push(linhasDoDia.join('\n'));
  }

  return blocos.join('\n\n');
}

/*************************************************
 * APLICA NEGRITO NOS TÍTULOS "Dia ...:"
 *************************************************/
function aplicarNegritoTitulosDescricao_(body) {
  var total = body.getNumChildren();

  for (var i = 0; i < total; i++) {
    var elemento = body.getChild(i);

    if (elemento.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      continue;
    }

    var paragrafo = elemento.asParagraph();
    var texto = paragrafo.getText();

    if (/^Dia\s.+:$/.test(texto)) {
      paragrafo.editAsText().setBold(true);
    }
  }
}

/*************************************************
 * FORMATA dd/MM/yyyy PARA "d de Mês de yyyy"
 *************************************************/
function formatarDataExtensoPTBR_(dataCompleta) {
  var match = String(dataCompleta || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return dataCompleta;

  var dia = Number(match[1]);
  var mes = Number(match[2]);
  var ano = Number(match[3]);

  var meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return dia + ' de ' + meses[mes - 1] + ' de ' + ano;
}
