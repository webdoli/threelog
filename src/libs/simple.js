function insertTag(tag_name) {

    let editor_textarea = document.getElementById("editor_textarea");
  
    let selection = null;
  
    if (editor_textarea.selectionStart == editor_textarea.selectionEnd)
      selection = editor_textarea.selectionStart;
    else
      selection = editor_textarea.value.slice(editor_textarea.selectionStart, editor_textarea.selectionEnd);
  
    switch (tag_name) {
      case "strong":
        tag_name = "strong";
        break;
  
      case "italic":
        tag_name = "i";
        break;
  
      case "underline":
        tag_name = "u";
        break;
  
      case "code":
        tag_name = "code-tag";
        break;
  
      default:
        tag_name = null;
        break;
    }
  
    if (tag_name != null)
      editor_textarea.setRangeText(`<${tag_name}>${selection}</${tag_name}>`);
  }
  
  function preview() {
    let text_to_render = document.getElementById("editor_textarea").value;
    console.log('text_code: ', document.getElementById('editor_textarea') );
  
    text_to_render = text_to_render.replace(/\n/g, "<br>");
  
    text_to_render = text_to_render.replace(/<script>/g, "");
    text_to_render = text_to_render.replace(/<\/script>/g, "");
  
    text_to_render = text_to_render.replace(/<link>/g, "");
    text_to_render = text_to_render.replace(/<\/link>/g, "");
  
    text_to_render = text_to_render.replace(/<div>/g, "");
    text_to_render = text_to_render.replace(/<\/div>/g, "");
  
    text_to_render = text_to_render.replace(/<p>/g, "");
    text_to_render = text_to_render.replace(/<\/p>/g, "");
  
    text_to_render = text_to_render.replace(/<span>/g, "");
    text_to_render = text_to_render.replace(/<\/span>/g, "");
  
    text_to_render = text_to_render.replace(/<style>/g, "");
    text_to_render = text_to_render.replace(/<\/style>/g, "");
  
    let render_div = document.getElementById("right_pane");
  
    render_div.innerHTML = text_to_render;
  }
  
  class Code extends HTMLElement {
    constructor() {
      super();
    }
  }
  
  customElements.define("code-tag", Code);
  