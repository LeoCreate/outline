import * as React from "react";
import { useTranslation } from "react-i18next";

export default function useDictionary() {
  const { t } = useTranslation();

  return React.useMemo(() => {
    return {
      addColumnAfter: t("Insert column after"),
      addColumnBefore: t("Insert column before"),
      addRowAfter: t("Insert row after"),
      addRowBefore: t("Insert row before"),
      alignCenter: t("Align center"),
      alignLeft: t("Align left"),
      alignRight: t("Align right"),
      alignFullWidth: t("Full width"),
      bulletList: t("Bulleted list"),
      checkboxList: t("Todo list"),
      codeBlock: t("Code block"),
      codeCopied: t("Copied to clipboard"),
      codeInline: t("Code"),
      comment: t("Comment"),
      copy: t("Copy"),
      createLink: t("Create link"),
      createLinkError: t("Sorry, an error occurred creating the link"),
      createNewDoc: t("Create a new doc"),
      deleteColumn: t("Delete column"),
      deleteRow: t("Delete row"),
      deleteTable: t("Delete table"),
      deleteImage: t("Delete image"),
      downloadImage: t("Download image"),
      replaceImage: t("Replace image"),
      em: t("Italic"),
      embedInvalidLink: t("Sorry, that link won’t work for this embed type"),
      file: t("File attachment"),
      findOrCreateDoc: `${t("Find or create a doc")}…`,
      h1: t("Big heading"),
      h2: t("Medium heading"),
      h3: t("Small heading"),
      heading: t("Heading"),
      hr: t("Divider"),
      image: t("Image"),
      fileUploadError: t("Sorry, an error occurred uploading the file"),
      imageCaptionPlaceholder: t("Write a caption"),
      info: t("Info"),
      infoNotice: t("Info notice"),
      link: t("Link"),
      linkCopied: t("Link copied to clipboard"),
      mark: t("Highlight"),
      newLineEmpty: `${t("Type '/' to insert")}…`,
      newLineWithSlash: `${t("Keep typing to filter")}…`,
      noResults: t("No results"),
      openLink: t("Open link"),
      goToLink: t("Go to link"),
      openLinkError: t("Sorry, that type of link is not supported"),
      orderedList: t("Ordered list"),
      pageBreak: t("Page break"),
      pasteLink: `${t("Paste a link")}…`,
      pasteLinkWithTitle: (service: string) =>
        t("Paste a {{service}} link…", {
          service,
        }),
      placeholder: t("Placeholder"),
      quote: t("Quote"),
      removeLink: t("Remove link"),
      searchOrPasteLink: `${t("Search or paste a link")}…`,
      strikethrough: t("Strikethrough"),
      strong: t("Bold"),
      subheading: t("Subheading"),
      table: t("Table"),
      mathInline: t("Math inline (LaTeX)"),
      mathBlock: t("Math block (LaTeX)"),
      tip: t("Tip"),
      tipNotice: t("Tip notice"),
      showDiagram: t("Show diagram"),
      showSource: t("Show source"),
      warning: t("Warning"),
      warningNotice: t("Warning notice"),
      insertDate: t("Current date"),
      insertTime: t("Current time"),
      insertDateTime: t("Current date and time"),
    };
  }, [t]);
}

export type Dictionary = ReturnType<typeof useDictionary>;
