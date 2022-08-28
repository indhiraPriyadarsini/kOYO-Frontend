import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
//import * as angular from 'angular';
import { RoundDetailsService } from '../../services/round-details.service';

@Component({
  selector: 'app-new-round',
  templateUrl: './new-round.component.html',
  styleUrls: ['./new-round.component.scss'],
})
export class NewRoundComponent implements OnInit {
  constructor(
    private renderer2: Renderer2,
    private roundDetails: RoundDetailsService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) { }
  static roundForm = new FormGroup({
    name: new FormControl('', Validators.required),
    template: new FormControl('', []),
    isTemplateRequired: new FormControl('', [Validators.required]),
    isSlotRequired: new FormControl('', [Validators.required]),
  });
  static rounddata: any;
  round: any = [{ name: '', id: null, roundId: '' }];
  count = 1;
  fieldId: any[] = [];
  iconId: any = [];
  divId: any = [];
  errorId: any = [];
  isAttInvalid: any = [];
  submitted = false;
  templateInvalid = false;
  isDisabled = false;
  attributeInvalid = false;
  data = {};
  insertedRound: any;
  get staticformGroup(): FormGroup {
    return NewRoundComponent.roundForm;
  }
  ngOnInit(): void {
    this.addAttribute();

    this.roundDetails.templateList().subscribe((value: any) => {
      let templates = value.Data;
      for (let i = 0; i < templates.length; i++) {
        let data = {
          id: templates[i].template_id,
          name: templates[i].template_name,
          roundId: templates[i].round_ids,
        };
        this.round.push(data);
      }
    });
  }

  handleChange(event: any) {
    var isTemplateRequired =
      NewRoundComponent.roundForm.get('isTemplateRequired');

    if (isTemplateRequired?.value === '1') {
      var disable = <HTMLInputElement>document.getElementById('template');
      if (disable) {
        disable.disabled = false;
      }
      var template = NewRoundComponent.roundForm.get('template');
      if (template && template?.value > 0) {
        this.templateInvalid = false;
      } else {
        this.templateInvalid = true;
      }
    } else if (isTemplateRequired?.value === '0') {
      this.templateInvalid = false;
      var disable = <HTMLInputElement>document.getElementById('template');
      if (disable) {
        disable.disabled = true;
      }
    }
  }

  templateSelect() {
    var isTemplateRequired =
      NewRoundComponent.roundForm.get('isTemplateRequired');

    if (isTemplateRequired?.value === '1') {
      var template = NewRoundComponent.roundForm.get('template');
      if (template && template?.value > 0) {
        this.templateInvalid = false;
      } else {
        this.templateInvalid = true;
      }
    }
  }
  addAttribute() {
    const label = this.renderer2.createElement('label');
    //label.classList.add('label');
    label.textContent = 'Attributes Name';

    const labelSpan = this.renderer2.createElement('span');
    labelSpan.classList.add('padRight0');
    labelSpan.classList.add('left');
    labelSpan.appendChild(label);

    const field = this.renderer2.createElement('input');
    field.setAttribute('type', 'text');
    field.setAttribute('id', 'field' + this.count);

    field.classList.add('attributeField');

    const error = this.renderer2.createElement('small');
    error.setAttribute('id', 'error' + this.count);
    //error.setAttribute('*ngIf', '(submitted) && isAttInvalid[' + this.count + ']');
    error.classList.add('text-danger');

    const errorDiv = this.renderer2.createElement('div');
    errorDiv.classList.add('errormsg');
    errorDiv.appendChild(error);
    //this.renderer2.setAttribute(error,'[ngIf]', '(submitted) && isAttInvalid[' + this.count + ']')
    //this.renderer2.setProperty(error,'[ngIf]', '(submitted) && isAttInvalid[' + this.count + ']')

    const inputSpan = this.renderer2.createElement('span');
    inputSpan.classList.add('padLeft0');
    inputSpan.classList.add('right');
    inputSpan.appendChild(field);
    inputSpan.appendChild(errorDiv);

    const svg = this.renderer2.createElement('img');
    svg.setAttribute('src', '../../../assets/remove.svg');
    svg.setAttribute('id', 'remove' + this.count);
    svg.classList.add('remove');

    svg.addEventListener('click', (event: any) => {
      let erase = document.getElementById(
        this.divId[this.iconId.indexOf(event.target.id)]
      );
      if (erase) {
        erase?.remove();
      }
      this.divId.splice(this.iconId.indexOf(event.target.id), 1);
      this.fieldId.splice(this.iconId.indexOf(event.target.id), 1);
      this.errorId.splice(this.iconId.indexOf(event.target.id), 1);
      this.isAttInvalid.splice(this.iconId.indexOf(event.target.id), 1);
      this.iconId.splice(this.iconId.indexOf(event.target.id), 1);
    
    });

    const iconSpan = this.renderer2.createElement('span');
    iconSpan.appendChild(svg);

    const div = this.renderer2.createElement('div');
    div.classList.add('flex');
    div.classList.add('margin10');
    div.setAttribute('id', 'div' + this.count);
    div.appendChild(labelSpan);
    div.appendChild(inputSpan);
    div.appendChild(iconSpan);
    const attributeCont = document.getElementById('attributeContainer');
    attributeCont?.appendChild(div);
    this.divId.push('div' + this.count);
    this.fieldId.push('field' + this.count);
    this.iconId.push('remove' + this.count);
    this.errorId.push('error' + this.count);
    this.isAttInvalid.push(false);
    this.count++;
  }



  validateAttribute(): any {
    var ret = false;
    for (var i = 0; i < this.fieldId.length; i++) {
      var temp = <HTMLInputElement>document.getElementById(this.fieldId[i]);
      if (temp.value.length < 1) {
        this.isAttInvalid[i] = true;
        (<HTMLInputElement>document.getElementById(this.errorId[i])).innerHTML =
          'invalid/empty';
        ret = true;
      } else {
        this.isAttInvalid[i] = false;
        (<HTMLInputElement>document.getElementById(this.errorId[i])).innerHTML =
          '';
      }
    }
    return ret;
  }
  validate() {
    this.submitted = true;
    this.spinner.show();
    let valid = this.validateAttribute();
    let name = NewRoundComponent.roundForm.get('name');
    let template = NewRoundComponent.roundForm.get('template');
    let isSlotRequired = NewRoundComponent.roundForm.get('isSlotRequired');
    let isTemplateRequired =NewRoundComponent.roundForm.get('isTemplateRequired');

    if (
      (isTemplateRequired?.value == '1' && this.templateInvalid == true) ||
      valid
    ) {
      return;
    }
    if (NewRoundComponent.roundForm.valid) {
      this.data['roundName'] = name?.value.trim();
      this.data['roundDescription'] = (<HTMLInputElement>(
        document.getElementById('description')
      )).value.trim();
      this.data['panel'] = isSlotRequired ? true : false;
      let attribute = '';
      if (this.fieldId.length > 0) {
        let temp = <HTMLInputElement>document.getElementById(this.fieldId[0]);
        let attGenerator = '';
        if (temp.value.length > 0) {
          attGenerator = temp.value.trim();
        }
        for (let i = 1; i < this.fieldId.length; i++) {
          temp = <HTMLInputElement>document.getElementById(this.fieldId[i]);
          if (temp.value.length > 0) {
            attGenerator = attGenerator + ',' + temp.value.trim();
          }
        }
        attribute = attGenerator;
      }
      this.data['attributes'] = attribute;
      this.roundDetails
        .roundDetailsInsertApiCall(this.data)
        .subscribe((value: any) => {
          this.insertedRound = value.Data;
          NewRoundComponent.rounddata = this.insertedRound;
          if (isTemplateRequired?.value === '0'){
              this.roundDetails.setRoundDetails(this.insertedRound)
          }
          else if (isTemplateRequired?.value === '1') {
            let insertedRoundId = this.insertedRound.round_details_id;
            let data = {
              templateId: parseInt(template.value),
            };
            for (let i = 0; i < this.round.length; i++) {
              if (this.round[i].id == template.value) {
                if (String(this.round[i].roundId).length == 0) {
                  data['roundIds'] = String(insertedRoundId);
                } else {
                  data['roundIds'] =
                    this.round[i].roundId + ',' + insertedRoundId;
                }
              }
            }
            this.roundDetails
            .templateUpdateApiCall(data)
            .subscribe((value: any) => {
             
            });
          }

          this.spinner.hide();
          this.toast.success('successfully created');
          
          if(this.roundDetails.templateName!=""){
            this.router.navigate(['pages', 'newTemplate']);
          }
          else{
            this.router.navigate(['pages', 'rounds-planner']);
          }
        });
    }
    
  }
  discard(){
    if(this.roundDetails.templateName!=""){
      this.router.navigate(['pages', 'newTemplate']);
    }
    else{
      this.router.navigate(['pages', 'rounds-planner']);
    }
  }
}
