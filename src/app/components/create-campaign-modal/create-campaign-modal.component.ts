import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule,  Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../../services/auth-service.service';
import { PodiumService } from '../../services/podium.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-create-campaign-modal',
  standalone: true,
  imports: [ ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './create-campaign-modal.component.html',
  styleUrls: ['./create-campaign-modal.component.css']
})
export class CreateCampaignModalComponent implements OnChanges {
  campaignForm: FormGroup;
  currentUser: any;
  @Input() campaign: any; // Campaña para editar
  @Input() isEditMode: boolean = false; // Modo de edición
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private authService: AuthServiceService, private podiumService: PodiumService) {
    this.currentUser = this.authService.getUserData();
    this.campaignForm = this.fb.group({
      name: ['', [Validators.required]],
      rhema: ['', [Validators.required]],
      goal: [0, [Validators.required, Validators.min(1)]],
      phrase: ['', [Validators.required]],
      status: [true, [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['campaign'] && this.campaign) {
      this.campaignForm.patchValue(this.campaign);
    }
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.isEditMode) {
      this.updateCampaign();
    } else {
      this.createCampaign();
    }
  }

  createCampaign() {
    if (this.campaignForm.value.status === true) {
      Swal.fire({
        title: 'Ya existe una campaña activa',
        text: '¿Desea inactivar la campaña activa actual para crear esta nueva campaña?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, inactivar y crear',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.inactivateCurrentCampaign().subscribe(() => {
            this.podiumService.createCampaign(this.createCampaignData()).subscribe(() => {
              Swal.fire('Éxito!', 'Campaña creada y antigua inactivada con éxito.', 'success').then(() => {
                this.closeModal();
              });
            });
          });
        }
      });
    } else {
      this.podiumService.createCampaign(this.createCampaignData()).subscribe(() => {
        Swal.fire('Éxito!', 'Campaña creada con éxito.', 'success').then(() => {
          this.closeModal();
        });
      });
    }
  }

  updateCampaign() {
    const {status} = this.campaignForm.value
    if(status === true){
      this.updateCampaignStatus(this.campaign)
    }
    this.podiumService.updateCampaign(this.campaign.id, this.updateCampaignData()).subscribe(() => {
      Swal.fire('Éxito!', 'Campaña actualizada con éxito.', 'success').then(() => {
        this.closeModal();
      });
    });
  }

  inactivateCurrentCampaign() {
    return this.podiumService.inactivateCurrentCampaign({
      status: false,
      updated_id: this.currentUser.user
    }).pipe(
      catchError(error => {
        console.error('Error al inactivar la campaña actual', error);
        return of(null);
      })
    );
  }

  updateCampaignData() {
    const { name, goal, rhema, phrase, status } = this.campaignForm.value;
    return {
      name,
      rhema,
      goal,
      phrase,
      status,
      updated_by: this.currentUser.user
    };
  }
  createCampaignData() {
    const { name, goal, rhema, phrase, status } = this.campaignForm.value;
    return {
      name,
      rhema,
      goal,
      phrase,
      status,
      created_by: this.currentUser.user,
      updated_by: this.currentUser.user
    };
  }
  updateCampaignStatus(item: any): void {
    const id = item.id
    const updated_by = this.currentUser.user
    console.log({id,updated_by})
    this.podiumService.activateCampaign({id, updated_by}).subscribe(response=>{
     console.log('respnse en activate podium',response)
    })
   }
}
