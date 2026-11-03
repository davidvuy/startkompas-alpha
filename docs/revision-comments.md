# Version-bound private comments

Comments attach to the exact saved document version and stable field key. Imported text has one stable block: its complete original source. Open Private revision comments from any saved business draft or imported-text reader. Choose a section, enter a comment, preview the exact anchor, and confirm saving. Resolve/reopen actions require a reason and a fresh confirmation. Original/current text and the possibly-outdated warning remain visible. Unsaved edits guard navigation and closing; they are excluded from recovery copies.

A later business-document version shows comments from its own ancestry only. The original anchor remains visible. Changed text, changed assertion/source context, or a document requiring review marks a comment possibly outdated. Unchanged text is not proof of continued relevance. Historical views do not acquire comments from future versions.

Add, resolve and reopen actions create immutable, fingerprinted artifacts. Resolution requires a reason and the current action ID. They never rewrite the source or establish evidence, acceptance or task completion. Maximums: 4000 characters per comment/reason, 500 actions per project, 200 document versions. Corrupt history is refused. Archived projects remain readable but cannot receive new actions.

API routes: `revision-comments` takes `ref,target`; `revision-comment-preview` takes `ref,revision,sha256,comment`; `revision-comment-resolution-preview` takes `ref,revision,sha256,resolution`; `revision-comment-save` takes `ref,preview,confirmed:true`. Target is `{kind:business|import,document_id}`; comment is `{target,key,comment}`; resolution is `{target,thread_id,latest_action_id,action:resolve|reopen,reason}`. All routes retain session/origin guards. Saving requires an exact current-project preview; retry returns the same receipt.

Comments are private project artifacts, not inserted into document/summary/PDF source. A whole-project backup still contains them. No sharing, notifications, semantic matching or automatic reattachment is provided.
