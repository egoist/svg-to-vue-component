const test = require('ava')
const toSFC = require('../')

test('main', t => {
  const sfc = toSFC(
    `
 <?xml version="1.0" encoding="UTF-8"?>
<svg width="48px" height="1px" viewBox="0 0 48 1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
    <title>Rectangle 5 可以</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="19-Separator" transform="translate(-129.000000, -156.000000)" fill="#063855">
            <g id="Controls/Settings" transform="translate(80.000000, 0.000000)">
                <g id="Content" transform="translate(0.000000, 64.000000)">
                    <g id="Group" transform="translate(24.000000, 56.000000)">
                        <g id="Group-2">
                            <rect id="Rectangle-5" x="25" y="36" width="48" height="1"></rect>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>
 `,
    { sync: true }
  )

  t.snapshot(sfc)
})

test('replace style tag', t => {
  const sfc = toSFC(`<svg><style>svg {width:20px;}</style></svg>`, {
    sync: true
  })

  t.true(sfc.component.includes('/lib/StyleComponent.js'))
  t.true(sfc.component.includes('<svg2vue-style>'))
})
