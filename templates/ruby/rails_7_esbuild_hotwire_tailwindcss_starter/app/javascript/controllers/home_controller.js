import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = []

  connect() {
    console.log('Hello World!!!');
  }

  run() {
    fetch('/test', function() {
      headers: { accepts: 'text/vnd.turbo-stream.html' }
    })
    .then(response => response.text())
    .then(html => {
      Turbo.renderStreamMessage(html)
    })
  }
}
