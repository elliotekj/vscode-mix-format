# Elixir's Mix Format for VSCode

A mix format extension for Visual Studio Code **with support for monorepos**.

## Features

- Supports `.ex`, `.exs` and `.heex` files
- Supports monorepos
- Formats via [`mix format`](https://hexdocs.pm/mix/main/Mix.Tasks.Format.html)

## Usage

You can set this extension to be your default formatter for Elixir and Heex
files with the following configuration in your `settings.json`:

```json
{
  "[elixir]": {
    "editor.defaultFormatter": "elliotekj.elixir-mix-format"
  },
  "[phoenix-heex]": {
    "editor.defaultFormatter": "elliotekj.elixir-mix-format"
  },
  "[html-eex]": {
    "editor.defaultFormatter": "elliotekj.elixir-mix-format"
  }
}
```

## Installation

The easiest way to install this extension is via the extensions manager in
VSCode.

Search: [`Mix Format for Elixir`](https://marketplace.visualstudio.com/items?itemName=elliotekj.elixir-mix-format)

## License

`Mix Format for Elixir` is released under the [`Apache License
2.0`](https://github.com/elliotekj/doubly_linked_list/blob/main/LICENSE).

## About

This extension was written by [Elliot Jackson](https://elliotekj.com).

- Blog: [https://elliotekj.com](https://elliotekj.com)
- Email: elliot@elliotekj.com
