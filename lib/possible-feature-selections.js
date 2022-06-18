// This is not used in "makes" directly, but a convenient function to help
// finding all possible combinations of selected features.
// The user skeleton repo can use this list for their e2e tests.
import applicable from './applicable.js';

class TreeNode {
  constructor(parent, feature) {
    this.parent = parent || null;
    this.feature = feature || '';
    this.children = [];
  }

  addChildFeature(feature) {
    const child = new TreeNode(this, feature);
    this.children.push(child);
    return child;
  }

  selectedFeatures() {
    let selected = [];
    let node = this;
    do {
      if (node.feature) selected.push(node.feature);
    } while((node = node.parent) !== null);
    return selected.reverse();
  }
}

function selectPossibleChoice(node, questions) {
  if (!questions.length) return;

  const [question, ...restQuestions] = questions;
  let {choices, multiple} = question;
  const ifCheck = question.if;

  const selectedFeatures = node.selectedFeatures();

  let skip = false;
  if (!choices) {
    skip = true;
  } else if (ifCheck && !applicable(selectedFeatures, ifCheck)) {
    skip = true;
  } else {
    choices = choices.filter(c => !c.if || applicable(selectedFeatures, c.if));
    if (!choices.length) skip = true;
  }

  if (skip) {
    return selectPossibleChoice(node, restQuestions);
  }

  if (multiple) {
    // Simplify multiple choices, either select all or none.
    // Select none
    selectPossibleChoice(node.addChildFeature(), restQuestions);
    // Select all
    let child = node;
    for (let i = 0; i < choices.length; i++) {
      if (choices[i].value) {
        child = child.addChildFeature(choices[i].value);
      }
    }
    selectPossibleChoice(child, restQuestions);
  } else {
    for (let i = 0; i < choices.length; i++) {
      const child = node.addChildFeature(choices[i].value);
      selectPossibleChoice(child, restQuestions);
    }
  }
}

export default function(questions) {
  if (!questions || !questions.length) return [];

  const root = new TreeNode();
  selectPossibleChoice(root, questions);

  let possible = [];

  function walk(node) {
    const {children} = node;
    if (!children.length) {
      const selected = node.selectedFeatures();
      if (selected.length) {
        possible.push(selected);
      }
      return;
    }
    children.forEach(walk);
  }

  walk(root);
  return possible;
}
