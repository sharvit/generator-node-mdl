import BaseGenerator from '../base-generator';

import { createRepository } from '../../lib/github';

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

  async end() {
    if (this.options.createGithubRepository) {
      const {
        data: { html_url: url },
      } = await createRepository({
        name: this.options.projectName,
        description: this.options.description,
      });

      this.log('\n\n');
      this.log(`Repository created: ${url}`);
    }
  }
}
