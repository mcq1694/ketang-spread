module.exports = ({ theme }) => ({
  ".button-default": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: theme("spacing.px"),
    borderColor: theme("colors.gray.400"),
    color: theme("colors.gray.400"),
    backgroundColor: theme("colors.white"),
    padding: `${theme("spacing.4")} ${theme("spacing.12")}`,
    fontSize: theme("fontSize.sm"),
    lineHeight: theme("lineHeight.20"),
    borderRadius: theme("borderRadius.DEFAULT"),
  },
  ".button-primary": {
    borderColor: theme("colors.primary"),
    color: theme("colors.white"),
    backgroundColor: theme("colors.primary"),
  },
  ".button-text": {
    borderColor: theme("colors.transparent"),
    color: theme("colors.gray.400"),
    backgroundColor: theme("colors.transparent"),
  },
  ".button-link": {
    borderColor: theme("colors.transparent"),
    color: theme("colors.primary"),
    backgroundColor: theme("colors.transparent"),
  },
  ".button-size-large": {
    padding: `${theme("spacing.10")} ${theme("spacing.20")}`,
    fontSize: theme("fontSize.xl"),
    lineHeight: theme("lineHeight.28"),
  },
  ".button-size-middle": {
    padding: `${theme("spacing.5")} ${theme("spacing.15")}`,
    fontSize: theme("fontSize.base"),
    lineHeight: theme("lineHeight.24"),
  },
  ".button-size-small": {
    padding: `${theme("spacing.4")} ${theme("spacing.8")}`,
    fontSize: theme("fontSize.xs"),
    lineHeight: theme("lineHeight.16"),
  },
  ".button-size-mini": {
    padding: `${theme("spacing.2")} ${theme("spacing.6")}`,
    fontSize: theme("fontSize.xs"),
    lineHeight: theme("lineHeight.16"),
  },
});
