/*************************************************
 * DATA DE ENTREGA ({3})
 *************************************************/
function obterDataEntregaHoje_() {
  var hoje = new Date();
  return formatarDataPorExtenso_(hoje);
}

/*************************************************
 * FORMATA Date PARA "d de Mês de yyyy"
 *************************************************/
function formatarDataPorExtenso_(data) {
  var dia = Number(Utilities.formatDate(data, Session.getScriptTimeZone(), 'd'));
  var mes = Number(Utilities.formatDate(data, Session.getScriptTimeZone(), 'M'));
  var ano = Number(Utilities.formatDate(data, Session.getScriptTimeZone(), 'yyyy'));

  var meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return dia + ' de ' + meses[mes - 1] + ' de ' + ano;
}
