## Bundle Size Comparison

<style>
  .good {
    color: #116329;
    background-color: #dafbe1;
  }
  .bad {
    color: #82071e;
    background-color: #ffebe9;
  }
</style>

<table>
  <thead>
    <tr>
      <th>File</th>
      <th>Bain</th>
      <th>Branch</th>
      <th>Diff</th>
    </tr>
  </thead>
<tbody>
  <tr class="{{#if diff.totalSize includeZero=false}}bad{{else if diff.totalSize includeZero=true}}{{else}}good{{/if}}">
    <td>Total</td>
    <td>{{main.totalSize}} kB</td>
    <td>{{branch.totalSize}} kB</td>
    <td>{{diff.totalSize}}</td>
  </tr>
  <tr class="{{#if diff.indexJsSize includeZero=false}}bad{{else if diff.indexJsSize includeZero=true}}{{else}}good{{/if}}">
    <td>index.js</td>
    <td>{{main.indexJsSize}} kB</td>
    <td>{{branch.indexJsSize}} kB</td>
    <td>{{diff.indexJsSize}}</td>
  </tr>
  <tr class="{{#if diff.indexJsGzipSize includeZero=false}}bad{{else if diff.indexJsGzipSize includeZero=true}}{{else}}good{{/if}}">
    <td>index.js (gzip)</td>
    <td>{{main.indexJsGzipSize}} kB</td>
    <td>{{branch.indexJsGzipSize}} kB</td>
    <td>{{diff.indexJsGzipSize}}</td>
  </tr>
  <tr class="{{#if diff.indexJsGzipSize includeZero=false}}bad{{else if diff.indexJsGzipSize includeZero=true}}{{else}}good{{/if}}">
    <td>index.css</td>
    <td>{{main.indexCssSize}} kB</td>
    <td>{{branch.indexCssSize}} kB</td>
    <td>{{diff.indexCssSize}}</td>
  </tr>
  <tr class="{{#if diff.indexJsGzipSize includeZero=false}}bad{{else if diff.indexJsGzipSize includeZero=true}}{{else}}good{{/if}}">
    <td>index.css (gzip)</td>
    <td>{{main.indexCssGzipSize}} kB</td>
    <td>{{branch.indexCssGzipSize}} kB</td>
    <td>{{diff.indexCssGzipSize}}</td>
  </tr>
  <tr class="{{#if diff.indexJsGzipSize includeZero=false}}bad{{else if diff.indexJsGzipSize includeZero=true}}{{else}}good{{/if}}">
    <td>Number of files</td>
    <td>{{main.numFiles}}</td>
    <td>{{branch.numFiles}}</td>
    <td>{{diff.numFiles}}</td>
  </tr>
  <tr class="{{#if diff.indexJsGzipSize includeZero=false}}bad{{else if diff.indexJsGzipSize includeZero=true}}{{else}}good{{/if}}">
    <td>Build Time</td>
    <td>{{main.buildTime}}</td>
    <td>{{branch.buildTime}}</td>
    <td>{{diff.buildTime}}</td>
  </tr>
</tbody>

<details><summary>Full build details</summary>

  ```
  {{branch.buildDetails}}
  ```
</details>

{{#if diff.totalSize includeZero=false}}
The full bundle is larger than main by {{diff.totalSize}} kB. :exclamation:
{{else}}
The full bundle is smaller than main by {{diff.totalSize}} kB. :tada:
{{/if}}

{{#if diff.indexJsSize includeZero=false}}
The index.js is larger than main by {{diff.indexJsSize}}. :exclamation:
{{else}}
The index.js is smaller than main by {{diff.indexJsSize}}. :tada:
{{/if}}

Run `npx vite-bundle-visualizer` to review the bundle in more detail.
