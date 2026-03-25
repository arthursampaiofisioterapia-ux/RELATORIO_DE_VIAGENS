/*************************************************
 * CONFIGURAÇÕES DE DATAS
 *************************************************/
var CONFIG_DATAS = {
  CABECALHOS_DATA_CRIACAO_POSSIVEIS: [
    'DATA CRIAÇÃO PROCESSO',
    'Data criação processo',
    'Data criacao processo',
    'Data de criação processo',
    'Data de criacao processo'
  ]
};

/*************************************************
 * OBTÉM PRIMEIRA E ÚLTIMA DATA A PARTIR DAS LINHAS
 * - Deve ser chamado pela função principal de CIDADES_VISITADAS
 *************************************************/
function obterIntervaloDatas_(cabecalhos, linhas) {
  var idxDataCriacao = encontrarIndiceColuna_(
    cabecalhos,
    CONFIG_DATAS.CABECALHOS_DATA_CRIACAO_POSSIVEIS
  );

  if (idxDataCriacao === -1) {
    throw new Error('Coluna de data de criação do processo não encontrada.');
  }

  var datasValidas = [];

  for (var i = 0; i < linhas.length; i++) {
    var data = parseDataBRouDate_(linhas[i][idxDataCriacao]);
    if (data) datasValidas.push(data);
  }

  if (datasValidas.length === 0) {
    throw new Error('Nenhuma data válida foi encontrada na coluna de criação do processo.');
  }

  var timestamps = [];
  for (var j = 0; j < datasValidas.length; j++) {
    timestamps.push(datasValidas[j].getTime());
  }

  var primeiraData = new Date(Math.min.apply(null, timestamps));
  var ultimaData = new Date(Math.max.apply(null, timestamps));

  return {
    primeiraData: formatarDataBR_(primeiraData),
    ultimaData: formatarDataBR_(ultimaData)
  };
}

/*************************************************
 * PARSE DE DATA (Date nativo ou string dd/MM/yyyy)
 *************************************************/
function parseDataBRouDate_(valor) {
  if (Object.prototype.toString.call(valor) === '[object Date]' && !isNaN(valor.getTime())) {
    return new Date(valor.getFullYear(), valor.getMonth(), valor.getDate());
  }

  var texto = String(valor || '').trim();
  if (!texto) return null;

  var match = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;

  var dia = Number(match[1]);
  var mes = Number(match[2]) - 1;
  var ano = Number(match[3]);

  var data = new Date(ano, mes, dia);
  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes ||
    data.getDate() !== dia
  ) {
    return null;
  }

  return data;
}

/*************************************************
 * FORMATAR DATA PARA dd/MM/yyyy
 *************************************************/
function formatarDataBR_(data) {
  return Utilities.formatDate(data, Session.getScriptTimeZone(), 'dd/MM/yyyy');
}
