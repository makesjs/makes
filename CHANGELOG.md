## [3.1.2](https://github.com/makesjs/makes/compare/v3.1.1...v3.1.2) (2022-06-18)



## [3.1.1](https://github.com/makesjs/makes/compare/v3.1.0...v3.1.1) (2022-06-13)


### Bug Fixes

* unknown features should checked against all possible features ([40d8732](https://github.com/makesjs/makes/commit/40d87328e241628651239cdd88ea05da8dee349b))



# [3.1.0](https://github.com/makesjs/makes/compare/v3.0.3...v3.1.0) (2022-06-09)


### Bug Fixes

* use absolute specifier for dynamic import ([26ea6fe](https://github.com/makesjs/makes/commit/26ea6fe2bc36f9ee9b04edddc300a466effedcc7))


### Features

* retain unknown features from command line and before.js ([72a0c79](https://github.com/makesjs/makes/commit/72a0c79fa50ffd7353cb83b51c0f06f5ff2711ae))
* support esm format for all skeleton code ([d9b7560](https://github.com/makesjs/makes/commit/d9b7560914a4ec54511be189e85b45f8af82e517))
* warn user/designer about missing property ([6716fd8](https://github.com/makesjs/makes/commit/6716fd89c1dce6e456b687b72ce03a671859325b))



## [3.0.3](https://github.com/makesjs/makes/compare/v3.0.2...v3.0.3) (2022-06-06)


### Bug Fixes

* keep unknown properties from predefinedProperties ([915a543](https://github.com/makesjs/makes/commit/915a5433ab384a23042b3821630862c302dc845d))



## [3.0.2](https://github.com/makesjs/makes/compare/v3.0.1...v3.0.2) (2022-04-05)



## [3.0.1](https://github.com/makesjs/makes/compare/v3.0.0...v3.0.1) (2022-04-02)



# [3.0.0](https://github.com/makesjs/makes/compare/v2.1.5...v3.0.0) (2022-04-02)


### chore

* nodejs v12 only ([16a052b](https://github.com/makesjs/makes/commit/16a052b34a96f79d34be7ad810eaf6c9df4a72f5))


### BREAKING CHANGES

* drop Nodejs v10 support



## [2.1.5](https://github.com/makesjs/makes/compare/v2.1.4...v2.1.5) (2021-04-24)


### Bug Fixes

* avoid extra foler in private git clone ([7d69fe3](https://github.com/makesjs/makes/commit/7d69fe3ab299da0417ef0764c51a93d453ab67aa)), closes [#14](https://github.com/makesjs/makes/issues/14)



## [2.1.4](https://github.com/makesjs/makes/compare/v2.1.3...v2.1.4) (2021-03-25)


### Bug Fixes

* allow . in default name regex, fix bitbucket tarball check ([5b746c6](https://github.com/makesjs/makes/commit/5b746c6823aba4db9ac43e0c0d05d4f6deb0feb3)), closes [#13](https://github.com/makesjs/makes/issues/13)



## [2.1.3](https://github.com/makesjs/makes/compare/v2.1.2...v2.1.3) (2021-03-06)


### Bug Fixes

* replace minimist with mri to avoid number conversion issue ([c1b5cf6](https://github.com/makesjs/makes/commit/c1b5cf619b351d17d0c87e2715d5b71f6908fdba))



## [2.1.2](https://github.com/makesjs/makes/compare/v2.1.1...v2.1.2) (2021-01-17)


### Bug Fixes

* bypass libnpmconfig bug on win32 ([47947da](https://github.com/makesjs/makes/commit/47947dadee624adc19e2656fe495730727567da0))



## [2.1.1](https://github.com/makesjs/makes/compare/v2.1.0...v2.1.1) (2020-11-17)


### Bug Fixes

* bypass windows argument rewrite issue ([f48092d](https://github.com/makesjs/makes/commit/f48092db52aaad156fddb09f2ef08b7bb5585a37)), closes [aurelia/cli#1188](https://github.com/aurelia/cli/issues/1188)



# [2.1.0](https://github.com/makesjs/makes/compare/v2.0.1...v2.1.0) (2020-11-16)


### Features

* vi style navigation for select prompt ([9ae1524](https://github.com/makesjs/makes/commit/9ae1524fbe7dab1942f5b151dbde9c6e37b85dd1))



## [2.0.1](https://github.com/makesjs/makes/compare/v2.0.0...v2.0.1) (2020-09-23)



# [2.0.0](https://github.com/makesjs/makes/compare/v1.6.1...v2.0.0) (2020-09-23)


### chore

* use nodejs v10 api stream.pipeline ([e32ef3f](https://github.com/makesjs/makes/commit/e32ef3f538c9c27a3d978aab9955bf19c0f6d3b9))


### BREAKING CHANGES

* drop nodejs v8 support



## [1.6.1](https://github.com/makesjs/makes/compare/v1.6.0...v1.6.1) (2020-08-12)


### Bug Fixes

* **prompts:** fix ctrl-w behaviour when the cursor is not at the end ([f7ad92b](https://github.com/makesjs/makes/commit/f7ad92b8e5bcc04dc64bbdc8c356f11ccf996748))



# [1.6.0](https://github.com/makesjs/makes/compare/v1.5.1...v1.6.0) (2020-08-12)


### Features

* **prompts:** add support of ctrl-w, ctrl-u, and ctrl-k ([e38ba9d](https://github.com/makesjs/makes/commit/e38ba9d6dac3a67e200f0592ff760ca020b679ed))



## [1.5.1](https://github.com/makesjs/makes/compare/v1.5.0...v1.5.1) (2020-08-11)


### Bug Fixes

* avoid undefined key in win32 terminal ([0d5e48e](https://github.com/makesjs/makes/commit/0d5e48ec4a9b23e5bfb10662cd4a29cf0688f476)), closes [#10](https://github.com/makesjs/makes/issues/10)



# [1.5.0](https://github.com/makesjs/makes/compare/v1.4.0...v1.5.0) (2020-05-15)


### Features

* print better error message on unpaired [@if](https://github.com/if) ([0126c48](https://github.com/makesjs/makes/commit/0126c48b245f99d40267963b99ee7da29fa09fa0))



# [1.4.0](https://github.com/makesjs/makes/compare/v1.3.1...v1.4.0) (2020-05-07)


### Features

* add helper func possibleFeatureSelections ([8eb8a27](https://github.com/makesjs/makes/commit/8eb8a270b524e181ee436e2ddd45036c73857b46))



## [1.3.1](https://github.com/makesjs/makes/compare/v1.3.0...v1.3.1) (2020-04-30)



# [1.3.0](https://github.com/makesjs/makes/compare/v1.2.0...v1.3.0) (2020-04-30)



# [1.2.0](https://github.com/makesjs/makes/compare/v1.1.2...v1.2.0) (2020-04-30)



## [1.1.2](https://github.com/makesjs/makes/compare/v1.1.1...v1.1.2) (2020-04-29)


### Bug Fixes

* go back to rollup-plugin-commonjs ([105eccd](https://github.com/makesjs/makes/commit/105eccde63c56384032346787f09788cff57f924)), closes [rollup/plugins#353](https://github.com/rollup/plugins/issues/353)



## [1.1.1](https://github.com/makesjs/makes/compare/v1.1.0...v1.1.1) (2020-04-29)



# [1.1.0](https://github.com/makesjs/makes/compare/v1.0.0...v1.1.0) (2020-03-19)


### Bug Fixes

* fix api usage on nodejs v8, fix https request path for gitlab tarball ([eedd98a](https://github.com/makesjs/makes/commit/eedd98a0d8d813d02a6c05decafb3e694c112f89))


### Features

* support proxy from npmrc or env ([da5b712](https://github.com/makesjs/makes/commit/da5b712410daa928e01df821220c65739c93d1e2)), closes [#6](https://github.com/makesjs/makes/issues/6)
* try git clone with https after ssh failed ([9f53716](https://github.com/makesjs/makes/commit/9f53716b101288a388a70a20131a1f6523de503c))



# [1.0.0](https://github.com/makesjs/makes/compare/v0.16.2...v1.0.0) (2020-02-27)



## [0.16.2](https://github.com/makesjs/makes/compare/v0.16.1...v0.16.2) (2019-12-13)



## [0.16.1](https://github.com/makesjs/makes/compare/v0.16.0...v0.16.1) (2019-12-13)



# [0.16.0](https://github.com/makesjs/makes/compare/v0.15.3...v0.16.0) (2019-12-09)


### Features

* support optional text format banner file ([a07eaaa](https://github.com/makesjs/makes/commit/a07eaaad5743aea7a259605cb67a0d397d472257))



## [0.15.3](https://github.com/makesjs/makes/compare/v0.15.2...v0.15.3) (2019-12-04)



## [0.15.2](https://github.com/makesjs/makes/compare/v0.15.1...v0.15.2) (2019-12-02)



## [0.15.1](https://github.com/makesjs/makes/compare/v0.15.0...v0.15.1) (2019-11-27)



# [0.15.0](https://github.com/makesjs/makes/compare/v0.14.0...v0.15.0) (2019-11-21)


### Bug Fixes

* "0" should be acceptable ([c0f4909](https://github.com/makesjs/makes/commit/c0f4909a9057a52f5efb68c2fd5276ad02f215c6)), closes [#4](https://github.com/makesjs/makes/issues/4)


### Features

* better log on transform error ([d38c043](https://github.com/makesjs/makes/commit/d38c0432c4f16415d197a7be04a3f3cb21acb02d))



# [0.14.0](https://github.com/makesjs/makes/compare/v0.13.0...v0.14.0) (2019-10-17)


### Features

* retain spaces before /* [@if](https://github.com/if) */ and after /* [@endif](https://github.com/endif) */ ([8388bb6](https://github.com/makesjs/makes/commit/8388bb6d9943cac96007778a2c6587e66ee38dc0))



# [0.13.0](https://github.com/makesjs/makes/compare/v0.12.2...v0.13.0) (2019-10-15)


### Features

* support zero length folder name for pure conditional wrapper ([87cd4cb](https://github.com/makesjs/makes/commit/87cd4cb6cb059dfcd90b96d7e7c46f24a1f76272))



## [0.12.2](https://github.com/makesjs/makes/compare/v0.12.1...v0.12.2) (2019-09-04)



## [0.12.1](https://github.com/makesjs/makes/compare/v0.12.0...v0.12.1) (2019-08-22)



# [0.12.0](https://github.com/makesjs/makes/compare/v0.11.0...v0.12.0) (2019-07-15)


### Features

* cleanup error print, enforce project name in silent mode ([54d1f30](https://github.com/makesjs/makes/commit/54d1f30))



# [0.11.0](https://github.com/makesjs/makes/compare/v0.10.2...v0.11.0) (2019-07-08)


### Features

* make sure asking for project name before "before" task ([658cf57](https://github.com/makesjs/makes/commit/658cf57))
* support silentQuestions in before task ([b298c6c](https://github.com/makesjs/makes/commit/b298c6c))


### BREAKING CHANGES

* previous "unattended" field is removed from before task return value.



## [0.10.2](https://github.com/makesjs/makes/compare/v0.10.1...v0.10.2) (2019-06-18)


### Bug Fixes

* missing .name ([80959a6](https://github.com/makesjs/makes/commit/80959a6))



## [0.10.1](https://github.com/makesjs/makes/compare/v0.10.0...v0.10.1) (2019-06-18)


### Bug Fixes

* don't cache skeleton repo. Sometime os cleared up files to leave out empty folders ([8857bff](https://github.com/makesjs/makes/commit/8857bff))



# [0.10.0](https://github.com/makesjs/makes/compare/v0.9.3...v0.10.0) (2019-06-12)


### Features

* expose prompts api to prepend/append transforms ([5727ed4](https://github.com/makesjs/makes/commit/5727ed4))



## [0.9.3](https://github.com/makesjs/makes/compare/v0.9.2...v0.9.3) (2019-06-03)



## [0.9.2](https://github.com/makesjs/makes/compare/v0.9.1...v0.9.2) (2019-05-30)



## [0.9.1](https://github.com/makesjs/makes/compare/v0.9.0...v0.9.1) (2019-05-30)


### Bug Fixes

* re-clone private repo for simplicity and reliability ([16b3824](https://github.com/makesjs/makes/commit/16b3824))



# [0.9.0](https://github.com/makesjs/makes/compare/v0.8.3...v0.9.0) (2019-05-30)


### Features

* support private skeleton repo ([e86ddde](https://github.com/makesjs/makes/commit/e86ddde)), closes [#1](https://github.com/makesjs/makes/issues/1)



## [0.8.3](https://github.com/makesjs/makes/compare/v0.8.2...v0.8.3) (2019-05-30)



## [0.8.2](https://github.com/3cp/makes/compare/v0.8.1...v0.8.2) (2019-05-28)


### Bug Fixes

* fix __ask-if-exists on readme files ([e9095f4](https://github.com/3cp/makes/commit/e9095f4))


### Features

* exports prompts module ([fb9ecc7](https://github.com/3cp/makes/commit/fb9ecc7))



## [0.8.1](https://github.com/3cp/makes/compare/v0.8.0...v0.8.1) (2019-05-24)



# [0.8.0](https://github.com/3cp/makes/compare/v0.7.0...v0.8.0) (2019-05-24)


### Features

* add dangerous but flexible [@eval](https://github.com/eval) to preprocess ([d49eb7a](https://github.com/3cp/makes/commit/d49eb7a))



# [0.7.0](https://github.com/3cp/makes/compare/v0.6.0...v0.7.0) (2019-05-23)


### Bug Fixes

* use cross-spawn to support Windows ([86cd1c7](https://github.com/3cp/makes/commit/86cd1c7))


### BREAKING CHANGES

* run(cmd, args) now needs second param args



# [0.6.0](https://github.com/3cp/makes/compare/v0.5.1...v0.6.0) (2019-05-22)


### Features

* add default validation to project name ([d5b4c91](https://github.com/3cp/makes/commit/d5b4c91))



## [0.5.1](https://github.com/3cp/makes/compare/v0.5.0...v0.5.1) (2019-05-22)



# [0.5.0](https://github.com/3cp/makes/compare/v0.4.0...v0.5.0) (2019-05-22)


### Features

* expose ansi-colors and sisteransi to "before" and "after" tasks ([0a06fc8](https://github.com/3cp/makes/commit/0a06fc8))



# [0.4.0](https://github.com/3cp/makes/compare/v0.3.3...v0.4.0) (2019-05-22)


### Features

* pass notDefaultFeatures to "after" task for possible summary printout ([99b5dcd](https://github.com/3cp/makes/commit/99b5dcd))



## [0.3.3](https://github.com/3cp/makes/compare/v0.3.2...v0.3.3) (2019-05-22)


### Bug Fixes

* guard select choices from reserved values ([fe8cc7a](https://github.com/3cp/makes/commit/fe8cc7a))



## [0.3.2](https://github.com/3cp/makes/compare/v0.3.1...v0.3.2) (2019-05-19)



## [0.3.1](https://github.com/3cp/makes/compare/v0.3.0...v0.3.1) (2019-05-14)


### Bug Fixes

* avoid unnecessary npm i --only-prod ([7a06004](https://github.com/3cp/makes/commit/7a06004))



# [0.3.0](https://github.com/3cp/makes/compare/v0.2.2...v0.3.0) (2019-05-14)


### Features

* support before/after tasks ([e607e8b](https://github.com/3cp/makes/commit/e607e8b))



## [0.2.2](https://github.com/3cp/makes/compare/v0.2.1...v0.2.2) (2019-04-30)



## [0.2.1](https://github.com/3cp/makes/compare/v0.2.0...v0.2.1) (2019-04-30)


### Bug Fixes

* proper exit code when fail ([81ad62b](https://github.com/3cp/makes/commit/81ad62b))



# [0.2.0](https://github.com/3cp/makes/compare/v0.1.0...v0.2.0) (2019-04-29)


### Bug Fixes

* fix loading relative local skeleton path ([b719abc](https://github.com/3cp/makes/commit/b719abc))


### Features

* unattended mode even for empty "-s" option ([a9893e0](https://github.com/3cp/makes/commit/a9893e0))



# [0.1.0](https://github.com/3cp/makes/compare/v0.0.14...v0.1.0) (2019-04-29)


### Bug Fixes

* fix wrong select choices ([1302724](https://github.com/3cp/makes/commit/1302724))


### Features

* verify target folder is available ([f9f86b4](https://github.com/3cp/makes/commit/f9f86b4))



## [0.0.14](https://github.com/3cp/makes/compare/v0.0.13...v0.0.14) (2019-04-26)


### Bug Fixes

* fix spawn call ([584986a](https://github.com/3cp/makes/commit/584986a))



## [0.0.13](https://github.com/3cp/makes/compare/v0.0.12...v0.0.13) (2019-04-26)


### Features

* only install skeleton dependencies, not devDependencies ([b307b16](https://github.com/3cp/makes/commit/b307b16))



## [0.0.12](https://github.com/3cp/makes/compare/v0.0.11...v0.0.12) (2019-04-23)



## [0.0.11](https://github.com/3cp/makes/compare/v0.0.10...v0.0.11) (2019-04-23)


### Bug Fixes

* support more local folder variants ([7080beb](https://github.com/3cp/makes/commit/7080beb))



## [0.0.10](https://github.com/3cp/makes/compare/v0.0.9...v0.0.10) (2019-04-23)


### Features

* support local dir starting with ~ ([0d2ed85](https://github.com/3cp/makes/commit/0d2ed85))



## [0.0.9](https://github.com/3cp/makes/compare/v0.0.8...v0.0.9) (2019-04-23)


### Bug Fixes

* fix https.request call on nodejs before v10 ([f07b81d](https://github.com/3cp/makes/commit/f07b81d))



## [0.0.8](https://github.com/3cp/makes/compare/v0.0.7...v0.0.8) (2019-04-22)


### Bug Fixes

* properly cache github/bitbucket/gitlab repos ([c8ea05a](https://github.com/3cp/makes/commit/c8ea05a))



## [0.0.7](https://github.com/3cp/makes/compare/v0.0.6...v0.0.7) (2019-04-19)


### Bug Fixes

* fix missing waiting on select prompt ([a6360d8](https://github.com/3cp/makes/commit/a6360d8))



## [0.0.6](https://github.com/3cp/makes/compare/v0.0.5...v0.0.6) (2019-04-19)


### Bug Fixes

* bypass rollup for runtime require ([cb016cc](https://github.com/3cp/makes/commit/cb016cc))



## [0.0.5](https://github.com/3cp/makes/compare/v0.0.4...v0.0.5) (2019-04-19)



## [0.0.4](https://github.com/3cp/makes/compare/v0.0.3...v0.0.4) (2019-04-18)


### Bug Fixes

* fix runtime dep on minimist ([61bd1f0](https://github.com/3cp/makes/commit/61bd1f0))



## [0.0.3](https://github.com/3cp/makes/compare/v0.0.2...v0.0.3) (2019-04-18)


### Bug Fixes

* fix bin file ([977565e](https://github.com/3cp/makes/commit/977565e))



## 0.0.2 (2019-04-18)


### Bug Fixes

* fix typo ([e53e558](https://github.com/3cp/makes/commit/e53e558))
* fix win32 tests ([5a77cff](https://github.com/3cp/makes/commit/5a77cff))
* proper lead on hint ([f9fa5fa](https://github.com/3cp/makes/commit/f9fa5fa))


### Features

* change select/multiselect behavior on value ([b52149f](https://github.com/3cp/makes/commit/b52149f))
* enable rollup bundle without runtime deps ([fa32b55](https://github.com/3cp/makes/commit/fa32b55))
* run-questionnaire ([4105f98](https://github.com/3cp/makes/commit/4105f98))
* skeleton-dir ([726e63b](https://github.com/3cp/makes/commit/726e63b))




