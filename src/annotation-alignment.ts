/*
 * ApexCharts positions the rounded background behind an annotation label
 * (`Helpers.addBackgroundToAnno()`) by measuring the label against the client
 * rect of the `.apexcharts-grid` group, assuming that group's box starts at the
 * plot area's origin. It doesn't: the grid group also holds the gridlines, and
 * a datetime axis regularly puts the first tick a few pixels left of the plot
 * area (the transparent helper lines of an empty grid likewise start one pixel
 * below its top). The background is then drawn shifted by exactly that
 * overhang, which is what makes the "Now" label sit off-centre on its blue
 * rectangle as soon as a gridline lands outside the grid, e.g. when a second
 * series changes the axis labels' width.
 *
 * The overhang is the grid group's own bounding box origin, so shifting each
 * background by it puts the label back in the middle. The shift is applied only
 * where it actually improves the centring, which keeps this a no-op on charts
 * ApexCharts already places correctly (and once it does so everywhere).
 */

// The background is drawn as a sibling right before the label it belongs to.
// An x1/x2 region gets a rect of its own, which carries this class and must not
// be mistaken for a label background.
const REGION_CLASS = 'apexcharts-annotation-rect';

const ANNOTATION_LABELS = [
  '.apexcharts-xaxis-annotation-label',
  '.apexcharts-yaxis-annotation-label',
  '.apexcharts-point-annotation-label',
].join(', ');

function shiftIfBetter(background: SVGElement, attribute: 'x' | 'y', shift: number, misalignment: number): void {
  if (Math.abs(misalignment - shift) >= Math.abs(misalignment)) return;
  const current = parseFloat(background.getAttribute(attribute) || '');
  if (isNaN(current)) return;
  background.setAttribute(attribute, `${current + shift}`);
}

/*
 * `root` must be the container of a single chart: the grid of another chart on
 * the same card (the brush) would measure a different plot area.
 */
export function alignAnnotationBackgrounds(root: ParentNode | null | undefined): void {
  if (!root) return;
  const grid = root.querySelector<SVGGraphicsElement>('.apexcharts-grid');
  if (!grid || typeof grid.getBBox !== 'function') return;

  let gridBox: DOMRect;
  try {
    gridBox = grid.getBBox();
  } catch (err) {
    // getBBox() throws on a chart which isn't displayed
    return;
  }
  if (!gridBox.width || (gridBox.x === 0 && gridBox.y === 0)) return;

  const gridRect = grid.getBoundingClientRect();
  // The chart may be rendered inside a CSS-zoomed container, in which case the
  // measurements below are not in the SVG's own units.
  const zoom = gridRect.width / gridBox.width || 1;

  root.querySelectorAll<SVGElement>(ANNOTATION_LABELS).forEach((label) => {
    const background = label.previousElementSibling as SVGElement | null;
    if (!background || background.tagName.toLowerCase() !== 'rect' || background.classList.contains(REGION_CLASS)) {
      return;
    }
    const labelRect = label.getBoundingClientRect();
    const backgroundRect = background.getBoundingClientRect();
    if (!labelRect.width || !backgroundRect.width) return;

    shiftIfBetter(
      background,
      'x',
      gridBox.x,
      (labelRect.left + labelRect.width / 2 - (backgroundRect.left + backgroundRect.width / 2)) / zoom,
    );
    shiftIfBetter(
      background,
      'y',
      gridBox.y,
      (labelRect.top + labelRect.height / 2 - (backgroundRect.top + backgroundRect.height / 2)) / zoom,
    );
  });
}
