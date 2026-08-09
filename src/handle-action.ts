// Vendored from `custom-card-helpers` (handle-action.ts, haptic.ts, navigate.ts,
// toggle-entity.ts, turn-on-off-entity.ts), which has been unmaintained since
// 2022. Behaviour matches what the card did when it imported those helpers,
// with one fix: `hass.user` is optional and is no longer dereferenced blindly.

import { fireEvent } from './fire-event';
import { ActionConfig, HapticType } from './types-config';
import { HomeAssistant } from './types-ha';

const STATES_OFF = ['closed', 'locked', 'off'];

export function forwardHaptic(hapticType: HapticType): void {
  fireEvent(window, 'haptic', hapticType);
}

export function navigate(path: string, replace = false): void {
  if (replace) {
    history.replaceState(null, '', path);
  } else {
    history.pushState(null, '', path);
  }
  fireEvent(window, 'location-changed', { replace });
}

export function toggleEntity(hass: HomeAssistant, entityId: string): Promise<unknown> {
  const turnOn = STATES_OFF.includes(hass.states[entityId]?.state);
  const stateDomain = entityId.split('.', 1)[0];
  const serviceDomain = stateDomain === 'group' ? 'homeassistant' : stateDomain;

  let service: string;
  switch (stateDomain) {
    case 'lock':
      service = turnOn ? 'unlock' : 'lock';
      break;
    case 'cover':
      service = turnOn ? 'open_cover' : 'close_cover';
      break;
    default:
      service = turnOn ? 'turn_on' : 'turn_off';
  }

  return hass.callService(serviceDomain, service, { entity_id: entityId });
}

export interface ActionConfigParams {
  entity?: string;
  camera_image?: string;
  hold_action?: ActionConfig;
  tap_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export function handleActionConfig(
  node: HTMLElement,
  hass: HomeAssistant,
  config: ActionConfigParams,
  actionConfig: ActionConfig | undefined,
): void {
  const lActionConfig: ActionConfig = actionConfig || { action: 'more-info' };

  if (
    lActionConfig.confirmation &&
    (!lActionConfig.confirmation.exemptions ||
      !lActionConfig.confirmation.exemptions.some((e) => e.user === hass.user?.id))
  ) {
    forwardHaptic('warning');

    // eslint-disable-next-line no-alert
    if (!confirm(lActionConfig.confirmation.text || `Are you sure you want to ${lActionConfig.action}?`)) {
      return;
    }
  }

  switch (lActionConfig.action) {
    case 'more-info':
      if (lActionConfig.entity || config.entity || config.camera_image) {
        fireEvent(node, 'hass-more-info', {
          entityId: lActionConfig.entity || config.entity || config.camera_image,
        });
      }
      break;
    case 'navigate':
      if (lActionConfig.navigation_path) {
        navigate(lActionConfig.navigation_path);
      }
      break;
    case 'url':
      if (lActionConfig.url_path) {
        window.open(lActionConfig.url_path);
      }
      break;
    case 'toggle':
      if (config.entity) {
        toggleEntity(hass, config.entity);
        forwardHaptic('success');
      }
      break;
    case 'call-service': {
      if (!lActionConfig.service) {
        forwardHaptic('failure');
        return;
      }
      const [domain, service] = lActionConfig.service.split('.', 2);
      hass.callService(domain, service, lActionConfig.service_data);
      forwardHaptic('success');
      break;
    }
    case 'fire-dom-event':
      fireEvent(node, 'll-custom', lActionConfig);
      break;
    default:
      break;
  }
}

export function handleAction(
  node: HTMLElement,
  hass: HomeAssistant,
  config: ActionConfigParams,
  action: string,
): void {
  let actionConfig: ActionConfig | undefined;

  if (action === 'double_tap' && config.double_tap_action) {
    actionConfig = config.double_tap_action;
  } else if (action === 'hold' && config.hold_action) {
    actionConfig = config.hold_action;
  } else if (action === 'tap' && config.tap_action) {
    actionConfig = config.tap_action;
  }

  handleActionConfig(node, hass, config, actionConfig);
}
