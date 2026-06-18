import { css, CSSResultGroup } from 'lit';

export const stylesApex: CSSResultGroup = css`
  ha-card {
    overflow: hidden;
    position: relative;
  }

  ha-card.section {
    height: 100%;
  }

  .wrapper {
    display: grid;
    grid-template-areas: 'header' 'graph';
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr;
  }
  ha-card.section .wrapper {
    height: 100%;
    min-width: 0;
    min-height: 0;
  }

  #graph-wrapper {
    height: 100%;
    grid-area: graph;
  }
  ha-card.section #graph-wrapper {
    min-width: 0;
    min-height: 0;
  }

  #brush {
    margin-top: -30px;
  }

  /* Needed for minimal layout */
  svg:not(:root) {
    overflow: visible !important;
  }

  #header {
    padding: 8px 16px 0px;
    grid-area: header;
    overflow: hidden;
  }
  ha-card.section #header {
    min-width: 0;
  }
  #header.floating {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
  }

  #header__title {
    color: var(--secondary-text-color);
    font-size: 16px;
    font-weight: 500;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-bottom: 5px;
  }

  #header__states {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    margin: -5px;
  }

  #header__states > * {
    margin: 5px;
  }

  #states__state {
    flex: 0 0 10%;
    position: relative;
  }

  #header__title {
    position: relative;
  }

  #header__title.actions,
  #states__state.actions {
    cursor: pointer;
  }

  #header__title.disabled,
  #states__state.disabled {
    pointer-events: none;
  }

  #state__value {
    display: table;
    white-space: nowrap;
  }

  #state__value > #state {
    font-size: 1.8em;
    font-weight: 500;
    white-space: nowrap;
  }

  #state__value > #uom {
    font-size: 1em;
    font-weight: 400;
    opacity: 0.8;
    white-space: nowrap;
  }

  #state__name {
    font-size: 0.8em;
    font-weight: 300;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  #last_updated {
    font-size: 0.63em;
    font-weight: 300;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: absolute;
    bottom: 0px;
    right: 4px;
    opacity: 0.5;
  }

  #version_info {
    font-size: 0.63em;
    font-weight: 300;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: absolute;
    bottom: 0px;
    left: 4px;
    opacity: 0.5;
  }

  /* Home Assistant theme overrides for ApexCharts' own stylesheet.
     ApexCharts 5.x detects the shadow root and injects its full, current
     apexcharts.css (and the legend CSS) there itself, so the card no longer
     carries a copy of it. We only remap ApexCharts' palette to Home Assistant
     theme variables; the \`.apexcharts-canvas\` prefix keeps these overrides
     ahead of the injected defaults regardless of stylesheet ordering. */
  .apexcharts-canvas .apexcharts-tooltip {
    --apx-tt-bg: var(--card-background-color);
    --apx-tt-color: var(--primary-text-color);
    --apx-tt-color-muted: var(--secondary-text-color);
    --apx-tt-border: var(--divider-color);
  }

  .apexcharts-canvas .apexcharts-tooltip-title {
    background: var(--primary-background-color);
  }

  .apexcharts-canvas .apexcharts-xaxistooltip,
  .apexcharts-canvas .apexcharts-yaxistooltip {
    --apx-axt-bg: var(--card-background-color);
    --apx-axt-color: var(--primary-text-color);
    --apx-axt-border: var(--divider-color);
  }

  /* The toolbar is disabled by default; these only take effect if a user
     re-enables it via apex_config, preserving the card's prior HA theming. */
  .apexcharts-canvas .apexcharts-menu-icon,
  .apexcharts-canvas .apexcharts-zoom-icon,
  .apexcharts-canvas .apexcharts-zoomin-icon,
  .apexcharts-canvas .apexcharts-zoomout-icon,
  .apexcharts-canvas .apexcharts-pan-icon,
  .apexcharts-canvas .apexcharts-reset-icon,
  .apexcharts-canvas .apexcharts-selection-icon {
    color: var(--primary-text-color);
  }

  .apexcharts-canvas .apexcharts-menu {
    background: var(--primary-background-color);
  }

  /* spinner */
  #spinner-wrapper {
    position: absolute;
    top: 5px;
    right: 5px;
    height: 20px;
    width: 20px;
    opacity: 0.5;
  }

  #spinner {
    position: relative;
  }

  .lds-ring,
  .lds-ring div {
    box-sizing: border-box;
  }
  .lds-ring {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    margin: 2px;
    border: 2px solid var(--primary-text-color);
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: var(--primary-text-color) transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
