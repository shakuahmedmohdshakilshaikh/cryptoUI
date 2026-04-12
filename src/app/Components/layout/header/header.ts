import { Component } from '@angular/core';
import { MaterialModule } from '../../../Material.Module';

@Component({
  selector: 'app-header',
  imports: [MaterialModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
