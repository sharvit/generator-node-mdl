import BaseGenerator from '../base-generator';

export default class extends BaseGenerator {
  writing() {
    if (this.options.githubTemplates) {
      const templatesToCopy = [
        { templatePath: '_github', destinationPath: '.github' },
        { templatePath: 'other', destinationPath: 'other' },
        { templatePath: 'contributing.md', destinationPath: 'contributing.md' },
      ];

      templatesToCopy.forEach(({ templatePath, destinationPath }) =>
        this.fs.copyTpl(
          this.templatePath(templatePath),
          this.destinationPath(destinationPath),
          this.options
        )
      );
    }
  }

  async install() {
    if (this.options.createGithubRepository) {
      await this._createGithubRepository();
    }
  }

  async _createGithubRepository() {
    this.log('Creating github repository...');
    const {
      data: { html_url: url },
    } = await this.options.github.createRepository({
      name: this.options.projectName,
      description: this.options.description,
    });

    this.log('\n\n');
    this.log(`Repository created: ${url}`);
  }
}
