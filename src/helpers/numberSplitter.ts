export default function numberSplitter(nom: number | undefined) {
  if (nom === undefined || isNaN(nom)) {

    return 0;

  }

  let formattedAmount = nom.toString().split('.');

  formattedAmount[0] = formattedAmount[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return formattedAmount.join('.');
}
