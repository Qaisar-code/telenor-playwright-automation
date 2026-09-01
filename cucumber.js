module.exports = {

  default: {

    requireModule: [
      "ts-node/register"
    ],

    require: [
      "src/support/world.ts",
      "src/support/hooks.ts",
      "src/step-definitions/**/*.ts"
    ],

    paths: [
      "features/**/*.feature"
    ],
    format: [

      "progress",

      "allure-cucumberjs/reporter"

    ]

  }

};