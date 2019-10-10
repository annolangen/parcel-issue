import {
  html,
  render,
  TemplateResult,
} from '../node_modules/lit-html/lit-html';
import { newFactor } from './factor';

const main = document.getElementById('main') as Element;

const elements = ['y', 'n', 'y', 'n', 'n', 'n'];
const f = newFactor(elements);

const spread = () => html`
  <table>
    ${[...f.elements()].map(
      v =>
        html`
          <tr>
            <td>${v}</td>
          </tr>
        `
    )}
  </table>
`;
const renderFunction: { [key: string]: () => TemplateResult } = {
  '#spread': spread,
  '#forof': () => {
    const histogram: { [key: string]: number } = {};
    for (const v of f.elements()) {
      histogram[v] = (histogram[v] || 0) + 1;
    }
    return html`
      <table>
        ${Object.entries(histogram).map(
          ([k, v]) =>
            html`
              <tr>
                <td>${k}</td>
                <td>${v}</td>
              </tr>
            `
        )}
      </table>
    `;
  },
};

function renderMain() {
  render((renderFunction[window.location.hash] || spread)(), main);
}

window.addEventListener('hashchange', renderMain);
renderMain();
