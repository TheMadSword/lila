import * as xhr from 'common/xhr';

lichess.load.then(() => {
  const localPrefs: [string, string, string, boolean][] = [
    ['behavior', 'arrowSnap', 'arrow.snap', true],
    ['behavior', 'courtesy', 'courtesy', false],
    ['behavior', 'scrollMoves', 'scrollMoves', true],
    ['notification', 'playBellSound', 'playBellSound', true],
  ];

  $('.security table form').on('submit', function (this: HTMLFormElement) {
    console.log("COINCOIN");
    xhr.text(this.action, { method: 'post', body: new URLSearchParams(new FormData(this) as any) });
    $(this).parent().parent().remove();
    return false;
  });

  $('form.autosubmit').each(function (this: HTMLFormElement) {
    const form = this,
      $form = $(form),
      showSaved = () => $form.find('.saved').removeClass('none');
    $form.find('input').on('change', function (this: HTMLInputElement) {
      console.log("this.name =  " + this.name + " val = " + this.value);
      console.log("chkbox = " + (this.type === 'checkbox'));
      if (this.type === 'checkbox') {
        const valueHidden = $(`input[type="hidden"][name="${this.name}"]`);
        const bitInputs = $(`input[type="checkbox"][name="${this.name}"]`);
        let sum = 0;
        for (let i = 0; i < bitInputs.length; ++i) {
          if (bitInputs !== undefined && bitInputs[i] !== undefined) {
            console.log("bit " + (<HTMLInputElement>bitInputs[i])?.value + " is " + (<HTMLInputElement>bitInputs[i])?.checked);
            if ((<HTMLInputElement>bitInputs[i])?.checked) {
              sum |= parseInt((<HTMLInputElement>bitInputs[i])?.value);
            }
          }
        }
        valueHidden.val(sum.toString());
        console.log("bitSum should be " + sum);
        console.log("valueHidden " + (<HTMLInputElement>valueHidden[0])?.value);
        //if this.checked ==> nop always
        // disabled all values BUT hidden that is set, then setTimeout & reenable/refresh
      }
      localPrefs.forEach(([categ, name, storeKey]) => {
        if (this.name == `${categ}.${name}`) {
          lichess.storage.boolean(storeKey).set(this.value == '1');
          showSaved();
        }
      });
      xhr.formToXhr(form).then(() => {
        showSaved();
        lichess.storage.fire('reload-round-tabs');
      });
    });
  });

  localPrefs.forEach(([categ, name, storeKey, def]) =>
    $(`#ir${categ}_${name}_${lichess.storage.boolean(storeKey).getOrDefault(def) ? 1 : 0}`).prop('checked', true)
  );

  $('form[action="/account/oauth/token/create"]').each(function (this: HTMLFormElement) {
    const form = $(this),
      submit = form.find('button.submit');
    let isDanger = false;
    const checkDanger = () => {
      isDanger = !!form.find('.danger input:checked').length;
      submit.toggleClass('button-red confirm', isDanger);
      submit.attr('data-icon', isDanger ? '' : '');
      submit.attr('title', isDanger ? submit.data('danger-title') : '');
    };
    checkDanger();
    form.find('input').on('change', checkDanger);
    submit.on('click', function (this: HTMLElement) {
      return !isDanger || confirm(this.title);
    });
  });
});
