# sphinx-presentations

sphinx-presentations is a Sphinx extension to convert documentation to Reveal.js presentations.

## Installation

`python -m pip install sphinxext-presentations`

## Usage
Add `sphinxext.presentations` to your extensions list in your `conf.py`

```python
extensions = [
   "sphinxext.presentations",
]
```

Presentations will launch when `?present` is appended to the url of a page. It is recommended to add a way for viewers to launch presentations without modifying the url (a button perhaps?).


## Building js assets

### Installing dependencies
```
npm install
```
### Building js
```
npx webpack
```