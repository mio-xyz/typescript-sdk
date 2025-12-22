# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.8] - 2025-12-22

### Added
- Documentation for app-specific description and questions fields in quickstart guide

## [1.0.7] - 2025-12-15

### Fixed
- Updated references to app.mio.xyz domain

## [1.0.6] - 2025-12-04

### Fixed
- Updated Mio dashboard URL

## [1.0.5] - 2025-12-03

### Added
- Explicit ESLint dependencies
- npm publish metadata and documentation included in package

### Changed
- Moved `react` to peerDependencies (optional, only required for /react entry)
- Moved `husky` to devDependencies

## [1.0.3] - 2025

### Changed
- Renamed SDK method `chat()` to `getContext()` for clarity
- Renamed SDK method `getUserSummary()` to `getContextSummary()` for consistency
- Renamed type `ChatRequestOptions` to `GetContextRequestOptions`
- React hook now exports `getContext` and `getContextSummary` instead of `chat` and `getSummary`
- Consolidated and simplified documentation guides

## [1.0.2] - 2025

### Fixed
- Removed `/v1` from `/connect` OAuth endpoint URL

### Added
- Development override support for API URLs via environment variables

## [1.0.1] - 2025

### Fixed
- Validation for refresh token response (id_token is now optional)
- Summary response handling
- Build distribution in npm package

### Changed
- Updated Mio API URLs to new standards

## [1.0.0] - 2025

### Added
- Initial release
