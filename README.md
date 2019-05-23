# Automated conversion of Excel to PDF using LibreOffice
- Read existing excel file.
- Modify cell values of existing excel file.
- Convert output of worksheet to PDF

## Install Node.js
- Run ``curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -``
- Run ``sudo apt-get install gcc g++ make``
- Run ``sudo apt-get install -y nodejs``
- Run ``node --version``
- Run ``npm --version``

## Install LibreOffice 
[LibreOffice Installation Reference](http://tipsonubuntu.com/2018/08/11/install-libreoffice-6-1-ubuntu-18-04-16-04/)

#### Run command to add the PPA
- Run ``sudo add-apt-repository ppa:libreoffice/ppa``
- Run ``sudo apt-get update``
- Run ``sudo apt-get install libreoffice``

## unoconv Installation
[Universal Office Converter (unoconv)](https://github.com/unoconv/unoconv)
- Run ``sudo apt-get install -y unoconv``
- Run ``unoconv --version``
