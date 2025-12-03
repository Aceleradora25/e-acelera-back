import { ComponentLoader} from "adminjs";

const componentLoader = new ComponentLoader();

// componentLoader.add("QuillStyles", "./styles/quill.css")
const Components = {
    RichTextEditor: componentLoader.add("RichTextEditor", "./components/markdownField")
}

export{
    componentLoader,
    Components
}