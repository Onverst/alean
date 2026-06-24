# Figma Context Rules

- Do not call Figma MCP unless explicitly requested.
- Always check `docs/figma-context/sections` first.
- Store context section-first, not breakpoint-first.
- Use one exact Figma section node URL per capture.
- Do not read the whole canvas unless explicitly requested.
- For one section variant, save:
  - `context.md`
  - `reference.png`
- Use `get_screenshot` when visual reference is needed.
- Use `download_assets` only when actual image assets are needed.
- Do not change code in the same step as Figma context capture unless explicitly requested.
- Before repeating MCP for the same section/breakpoint, explain what is missing.
