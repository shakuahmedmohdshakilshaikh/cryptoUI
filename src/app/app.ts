import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./Components/layout/sidebar/sidebar";
import { Header } from "./Components/layout/header/header";
import { Dashboard } from "./Components/pages/dashboard/dashboard";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Dashboard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('cryptoUi');
}
