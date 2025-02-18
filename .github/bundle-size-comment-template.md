## Bundle Size Comparison

<table>
  <thead>
    <tr>
      <th>File</th>
      <th>Main</th>
      <th>Branch</th>
      <th>Diff</th>
    </tr>
  </thead>
<tbody>
  <tr style="{{#if diff.totalSize includeZero=false}}{{badStyle}}{{else if diff.totalSize includeZero=true}}{{else}}{{goodStyle}}{{/if}}">
    <td>Total</td>
    <td>{{main.totalSize}} kB</td>
    <td>{{branch.totalSize}} kB</td>
    <td>{{diff.totalSize}} kB</td>
  </tr>
  <tr style="{{#if diff.indexJsSize includeZero=false}}{{badStyle}}{{else if diff.indexJsSize includeZero=true}}{{else}}{{goodStyle}}{{/if}}">
    <td>index.js</td>
    <td>{{main.indexJsSize}} kB</td>
    <td>{{branch.indexJsSize}} kB</td>
    <td>{{diff.indexJsSize}} kB</td>
  </tr>
  <tr style="{{#if diff.indexJsGzipSize includeZero=false}}{{badStyle}}{{else if diff.indexJsGzipSize includeZero=true}}{{else}}{{goodStyle}}{{/if}}">
    <td>index.js (gzip)</td>
    <td>{{main.indexJsGzipSize}} kB</td>
    <td>{{branch.indexJsGzipSize}} kB</td>
    <td>{{diff.indexJsGzipSize}} kB</td>
  </tr>
  <tr style="{{#if diff.indexJsGzipSize includeZero=false}}{{badStyle}}{{else if diff.indexJsGzipSize includeZero=true}}{{else}}{{goodStyle}}{{/if}}">
    <td>index.css</td>
    <td>{{main.indexCssSize}} kB</td>
    <td>{{branch.indexCssSize}} kB</td>
    <td>{{diff.indexCssSize}} kB</td>
  </tr>
  <tr style="{{#if diff.indexJsGzipSize includeZero=false}}{{badStyle}}{{else if diff.indexJsGzipSize includeZero=true}}{{else}}{{goodStyle}}{{/if}}">
    <td>index.css (gzip)</td>
    <td>{{main.indexCssGzipSize}} kB</td>
    <td>{{branch.indexCssGzipSize}} kB</td>
    <td>{{diff.indexCssGzipSize}} kB</td>
  </tr>
  <tr style="{{#if diff.indexJsGzipSize includeZero=false}}{{badStyle}}{{else if diff.indexJsGzipSize includeZero=true}}{{else}}{{goodStyle}}{{/if}}">
    <td>Number of files</td>
    <td>{{main.numFiles}}</td>
    <td>{{branch.numFiles}}</td>
    <td>{{diff.numFiles}}</td>
  </tr>
  <tr style="{{#if diff.indexJsGzipSize includeZero=false}}{{badStyle}}{{else if diff.indexJsGzipSize includeZero=true}}{{else}}{{goodStyle}}{{/if}}">
    <td>Build Time</td>
    <td>{{main.buildTime}} s</td>
    <td>{{branch.buildTime}} s</td>
    <td>{{diff.buildTime}} s</td>
  </tr>
</tbody>

<details><summary>Full build details</summary>

  ```
  {{branch.buildDetails}}
  ```
</details>

{{#if diff.totalSize > 0 includeZero=false}}
The full bundle is larger than main by {{diff.totalSize}} kB. :exclamation:
{{else}}
The full bundle is smaller than main by {{diff.totalSize}} kB. :tada:
{{/if}}

{{#if diff.indexJsSize > 0 includeZero=false}}
The index.js is larger than main by {{diff.indexJsSize}} kB. :exclamation:
{{else}}
The index.js is smaller than main by {{diff.indexJsSize}} kB. :tada:
{{/if}}

Run `npx vite-bundle-visualizer` to review the bundle in more detail.
