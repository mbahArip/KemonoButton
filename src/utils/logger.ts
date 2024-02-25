class FancyLogger {
  private logColor = `background: #16a34a`;
  private debugColor = `background: #0ea5e9`;
  private errorColor = `background: #f85032`;
  private badgeStyle = [
    `color: #fff`,
    `font-weight: bold`,
    `font-size: 12px`,
    `padding: 2px 6px`,
    `border-radius: 4px`,
  ];

  constructor() {}

  public log(message: string) {
    console.log(
      "%cKemonoButton[log]",
      `${this.logColor};${this.badgeStyle.join(";")}`,
      message
    );
  }
  public debug(message: string) {
    console.debug(
      "%cKemonoButton[debug]",
      `${this.debugColor};${this.badgeStyle.join(";")}`,
      message
    );
  }
  public error(message: string) {
    console.error(
      "%cKemonoButton[error]",
      `${this.errorColor};${this.badgeStyle.join(";")}`,
      `${message}\nPlease report this issue to the developer at https://github.com/mbahArip/KemonoButton/issues`
    );
  }
}

const logger = new FancyLogger();
export default logger;
