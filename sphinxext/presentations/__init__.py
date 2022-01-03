from typing import Any, Dict
from pathlib import Path
from sphinx.application import Sphinx


def setup(app: Sphinx) -> Dict[str, Any]:

    static_dir = Path(__file__).parent / "static"
    app.connect(
        "builder-inited",
        (lambda app: app.config.html_static_path.append(static_dir.as_posix())),
    )

    app.add_js_file(Path("./js/present.js").as_posix(), kwargs={"async": "async"})

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
