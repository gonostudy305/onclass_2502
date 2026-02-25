import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Test } from "./test/test";
import { Crud } from "./crud/crud";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Test, Crud],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-client');
}