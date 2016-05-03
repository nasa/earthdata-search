import style from '../css/example.useable.less';
import templateHtml from '../html/example.html';

style.use();

$(document).ready(function() {
  console.log("You may use Javascript to manipulate the page");
  $(document.body).append(templateHtml);
});
