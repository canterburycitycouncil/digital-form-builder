import { FormDefinition } from "@xgovformbuilder/model";
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  convertFromHTML,
  DraftHandleValue,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  RichUtils,
} from "draft-js";
import React, { FC, useRef } from "react";
import { useState } from "react";

import { Flyout } from "../Flyout";
import { RenderInPortal } from "../RenderInPortal";
import { SubmissionMessageLinkCreate } from "./SubmissionMessageLinkCreate";
import { SubmissionMessageSelectVariable } from "./submissionMessageSelectVariable";

interface Props {
  defaultValue?: string;
  onChange: (value: string) => void;
  data: FormDefinition;
}

enum BlockTags {
  "unstyled" = "span",
  "paragraph" = "p",
  "header-one" = "h1",
  "header-two" = "h2",
  "header-three" = "h3",
  "header-four" = "h4",
  "header-five" = "h5",
  "header-six" = "h6",
  "unordered-list-item" = "ul",
  "ordered-list-item" = "ol",
  "blockquote" = "blockquote",
  "code-block" = "code",
}

export const FormDetailsSubmissionMessage: FC<Props> = ({
  defaultValue,
  onChange,
  data,
}) => {
  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);
  //   const convertStringToBlockArray = (string: string) => {
  //     let html = new DOMParser().parseFromString(string, "text/html");
  //     let blocks: ContentBlock[] = [];
  //     let htmlBody = html.querySelector("body");
  //     if (htmlBody) {
  //       for (let i = 0; i < htmlBody.children.length; i++) {
  //         let child = htmlBody.children.item(i);
  //         if (child) {
  //           let tag = child.nodeName.toLowerCase();
  //           console.log(tag);
  //           let blockType = Object.keys(BlockTags)[
  //             Object.values(BlockTags).indexOf((tag as unknown) as BlockTags)
  //           ];
  //           console.log(child.innerHTML);
  //           blocks.push(
  //             new ContentBlock({
  //               key: genKey(),
  //               type: blockType,
  //               characterList: List(
  //                 Repeat(CharacterMetadata.create(), child.innerHTML.length)
  //               ),
  //               text: child.innerHTML,
  //             })
  //           );
  //         }
  //       }
  //     }
  //     console.log(blocks);
  //     return blocks;
  //   };
  const convertStringToBlockArray = convertFromHTML(defaultValue ?? "");

  const editor = useRef(null);
  const [editorState, setEditorState] = useState(
    defaultValue
      ? EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertStringToBlockArray.contentBlocks,
            convertStringToBlockArray.entityMap
          ),
          decorator
        )
      : EditorState.createEmpty()
  );
  const [selectingVariable, setSelectingVariable] = useState<boolean>(false);
  const [selectingLink, setSelectingLink] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>();

  const saveVariable = (variable: string) => {
    let contentState = editorState.getCurrentContent();
    let newContent = ContentState.createFromText(
      contentState.getPlainText() + variable
    );
    handleChange(EditorState.createWithContent(newContent));
    setSelectingVariable(false);
  };

  const handleKeyCommand = (
    command: string,
    editorState: EditorState,
    _eventTimeStamp: number
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const mapKeyToEditorCommand = (e: React.KeyboardEvent<{}>) => {
    if (e.keyCode && e.keyCode === 9 /* TAB */) {
      // @ts-ignore
      const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        handleChange(newEditorState);
      }
      return null;
    }
    // @ts-ignore
    return getDefaultKeyBinding(e);
  };

  const promptForLink = () => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = "";
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }
      setSelectingLink(true);
      setLinkUrl(url);
    }
  };

  const confirmLink = (url: string) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "LINK",
      "MUTABLE",
      { url: url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
    setSelectingLink(false);
  };

  const toggleBlockType = (blockType: string) => {
    if (blockType === "variable") {
      setSelectingVariable(true);
    } else if (blockType === "link") {
      promptForLink();
    } else {
      handleChange(RichUtils.toggleBlockType(editorState, blockType));
    }
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    handleChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const handleChange = (value: EditorState) => {
    setEditorState(value);
    let valueBlocks = value.getCurrentContent().getBlocksAsArray();
    let plainTextValue = convertBlockArrayToString(valueBlocks);
    console.log(plainTextValue);
    onChange(plainTextValue);
  };

  const convertBlockArrayToString = (blocks: ContentBlock[]) => {
    return blocks
      .map((block) => {
        let type = block.getType();
        let tag = BlockTags[type];
        let innerText = block.getText();
        let contentState = editorState.getCurrentContent();
        const changeInnerTextRange = (start: number, end: number) => {
          let entity = contentState.getEntity(block.getEntityAt(start));
          if (entity) {
            let startPart = innerText.substring(0, start);
            let middlePart = innerText.substring(start, end);
            let endPart = innerText.substring(end, innerText.length);
            innerText = `${startPart}<a href="${
              entity.getData().url
            }">${middlePart}</a>${endPart}`;
          }
        };
        findLinkEntities(block, changeInnerTextRange, contentState);
        return `<${tag}>${innerText}</${tag}>`;
      })
      .join("");
  };
  return (
    <>
      {selectingVariable && (
        <RenderInPortal>
          <Flyout
            title={"Select variable for submission message"}
            onHide={(_e) => setSelectingVariable(false)}
            width={""}
          >
            <SubmissionMessageSelectVariable
              data={data}
              onSave={saveVariable}
            />
          </Flyout>
        </RenderInPortal>
      )}
      {selectingLink && linkUrl !== undefined && (
        <RenderInPortal>
          <Flyout
            title={"Create link"}
            onHide={(_e) => setSelectingLink(false)}
            width={""}
          >
            <SubmissionMessageLinkCreate url={linkUrl} onChange={confirmLink} />
          </Flyout>
        </RenderInPortal>
      )}
      <div className="govuk-form-group">
        <span className="govuk-label govuk-label--s">Submission message</span>
        <div className="govuk-hint" id="target-feedback-form-hint">
          <p>
            A custom submission message can be provided at the end of the form
            here. If no submission message is supplied, the fallback message
            will be used.
          </p>
        </div>
        <div className="RichEditor-wrapper">
          <BlockStyleControls
            editorState={editorState}
            onToggle={toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={toggleInlineStyle}
          />
          <div className="RichEditor-editor">
            <Editor
              ref={editor}
              editorState={editorState}
              onChange={handleChange}
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              handleKeyCommand={handleKeyCommand}
              keyBindingFn={mapKeyToEditorCommand}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block: ContentBlock) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return "";
  }
}

interface StyleButtonProps {
  onToggle: (style: string) => void;
  style: string;
  active?: boolean;
  label: string;
}

const StyleButton: FC<StyleButtonProps> = ({
  onToggle,
  style,
  active,
  label,
}) => {
  const handleToggle = (e) => {
    e.preventDefault();
    onToggle(style);
  };

  let className = "RichEditor-styleButton";
  if (active) {
    className += " RichEditor-activeButton";
  }

  return (
    <span className={className} onMouseDown={handleToggle}>
      {label}
    </span>
  );
};

const BLOCK_TYPES = [
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
  { label: "Blockquote", style: "blockquote" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "Code Block", style: "code-block" },
  { label: "Variable", style: "variable" },
  { label: "Link", style: "link" },
];

interface BlockStyleProps {
  editorState: EditorState;
  onToggle: (blockType: string) => void;
}

const BlockStyleControls: FC<BlockStyleProps> = ({ editorState, onToggle }) => {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

var INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
  { label: "Monospace", style: "CODE" },
];

interface InlineStyleProps {
  editorState: EditorState;
  onToggle: (inlineStyle: string) => void;
}

const InlineStyleControls: FC<InlineStyleProps> = ({
  editorState,
  onToggle,
}) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

interface LinkProps {
  entityKey: string;
  children: React.ReactNode;
  contentState: ContentState;
}

const Link: FC<LinkProps> = ({ entityKey, children, contentState }) => {
  const { url } = contentState.getEntity(entityKey).getData();
  return <a href={url}>{children}</a>;
};

type FindEntitiesCallback = (start: number, end: number) => void;

const findLinkEntities = (
  contentBlock: ContentBlock,
  callback: FindEntitiesCallback,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};
