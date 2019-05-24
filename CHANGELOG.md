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




