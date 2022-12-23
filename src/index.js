(function () {
  /**
   * Git class represents a repository
   * @param {string} name repository
   */

  function Git(name) {
    this.name = name; // Repo name
    this.lastCommitId = -1; //keep track of last commit id
    this.HEAD = null; // Reference to last Commit
    this.branches = [];

    let master = new Branch('master', null); // is passed as we don't need any commit on initiation
    this.branches.push('Master');
    this.HEAD = master; // HEAD points to current branch
  }

  /**
   *
   * Commit class
   * A single commit
   * @param {number} id         ID of commit
   * @param {string}  msg       Commit massage
   * @param {string}  parent    Parent Commit
   */

  function Commit(id, parent, massage) {
    this.id = id;
    this.parent = parent;
    this.massage = massage;
  }

  function Branch(name, commit) {
    this.name = name;
    this.commit = commit;
  }

  /**
   * Make commit
   * this is basically a subclass of git or a child
   * This func implements the commit logic
   * @param {string} massage Commit massage
   * @param {Commit}  create commit massage
   */

  Git.prototype.commit = function (massage) {
    let commit = new Commit(
      (this.lastCommitId = this.lastCommitId + 1),
      this.HEAD,
      massage
    ); // an obj with the { id, and commit massage }
    this.HEAD.commit = commit;

    return commit;
  };

  Git.prototype.log = function () {
    let commit = this.HEAD.commit; // last commit ref by Git class or parent
    let history = []; // array of commits in reverse oder. basically a log of commits

    while (commit) {
      history.push(commit);
      commit = commit.parent;
    }

    return history;
  };

  Git.prototype.checkout = function (branchName) {
    for (let i = 0; i < this.branches.length; i++) {
      if (this.branches[i] === branchName) {
        console.log(
          'Switched to existing branch: ' + branchName
        );
        this.HEAD = this.branches[1];
        return this;
      }
      let newBrach = new Branch(
        branchName,
        this.HEAD.commit
      );
      this.branches.push(newBrach);
      this.HEAD = newBrach;
      console.log('Switched to new branch: ' + branchName);
      return this;
    }
  };

  // Expose Git class to window
  //   window.Git = Git;
  // if (typeof window !== undefined) {
  //   window.Git = Git;
  // } else {
  global.Git = Git;
  // }

  let repo = new Git('test');
  repo.commit('Initial commit');
  repo.commit('node');
  repo.commit('fix: typo');

  function historyToIdMapper(history) {
    let ids = history.map(function (commit) {
      return commit.id;
    });
    return ids.join('-');
  }
  console.assert(historyToIdMapper(repo.log()) === '1-0');
  console.log(historyToIdMapper(repo.log()));
  console.log(repo.log());
  // repo.checkout('testing');
})();
