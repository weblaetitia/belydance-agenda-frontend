import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { EditorState } from "lexical";
import { Event } from "../../types/types";
import "./description-editor.css";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import ExampleTheme from "./plugins/ExampleTheme";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

const getNodeFromDescription = (initialText: string): string => {
  const clean = initialText.replace(/"/g, "'"); // remove double quotes
  const splitedText = clean.split("\n");
  const nodes = `{
    "root": {
      "children": [
        ${splitedText.map(
          (p, i) => `{
            "children": [{"detail":0,"format":0,"mode":"normal","style":"","text":"${p}","type":"text","version":1}],
            "direction":"ltr",
            "format":"",
            "indent":0,
            "type":"paragraph",
            "version":1
          }${i === splitedText.length - 1 ? "," : ""}`
        )}
      {
        "children": [{"detail":0,"format":0,"mode":"normal","style":"","text":"","type":"text","version":1}],
        "direction":"ltr",
        "format":"",
        "indent":0,
        "type":"paragraph",
        "version":1
      }
    ],
    "direction":"ltr",
    "format":"",
    "indent":0,
    "type":"root",
    "version":1
  }
}`;

  return nodes;
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
const onError = (error: Error): void => {
  console.error(error);
};

interface DescriptionEditorProps {
  event?: Event;
  setDescription: (descriptionText: string) => void;
}

const DescriptionEditor: React.FC<DescriptionEditorProps> = ({ event, setDescription }) => {
  const onChange = (editorState: EditorState): void => {
    const editorStateJSON = editorState.toJSON();
    setDescription(JSON.stringify(editorStateJSON));
  };

  const setEditorState = (eventDescription: string): string | null => {
    let json;
    try {
      json = JSON.parse(eventDescription);
      if (json) {
        return eventDescription;
      } else {
        return null;
      }
    } catch (error) {
      return getNodeFromDescription(eventDescription);
    }
  };

  const initialConfig = {
    namespace: "MyEditor",
    theme: ExampleTheme,
    editable: true,
    editorState: event?.eventDescription ? setEditorState(event.eventDescription) : null,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<div className="editor-placeholder">Enter some rich text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default DescriptionEditor;
