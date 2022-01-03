import subprocess
import setuptools

try:
    ret = subprocess.check_output(
        "git describe --tags --abbrev=0",
        shell=True,
    )
    version = ret.decode("utf-8").strip()
except:
    version = "main"

with open("README.md", "r", encoding="utf-8") as readme:
    long_description = readme.read()

setuptools.setup(
    name="sphinxext-presentations",
    version=version,
    author="Vasista Vovveti",
    author_email="vasistavovveti@gmail.com",
    description="Sphinx Extension that turns documentation into presentations.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/wpilibsuite/sphinx-presentations",
    packages=["sphinxext/presentations"],
    package_data={
        "sphinxext/presentations": [
            "static/css/*",
            "static/js/*",
        ]
    },
    include_package_data=True,
    install_requires=["sphinx>=2.0"],
    classifiers=[
        "Environment :: Plugins",
        "Environment :: Web Environment",
        "Framework :: Sphinx :: Extension",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: BSD License",
        "Natural Language :: English",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python",
        "Topic :: Documentation :: Sphinx",
        "Topic :: Documentation",
        "Topic :: Software Development :: Documentation",
        "Topic :: Text Processing",
        "Topic :: Utilities",
    ],
    python_requires=">=3.6",
)
