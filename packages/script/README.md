# EuglenaScript

EuglenaScript is a scripting language enable us to create an euglena application in a more easy way. Creation of the application is possible with some dedicated files for particular jobs. The files are listed below.

|File Type          |File Extension     |Description                                                    |
|-------------------|:-----------------:|---------------------------------------------------------------|
|chromosome         |[.chr](docs/file-type-chr) | Contains gene objects                                 |
|particles          |[.par](docs/file-type-par) | Contains particle objects.                            |
|organelle          |[.org](docs/file-type-org) | Contains definitions of an organelle                  |
|organelle          |[.ori](docs/file-type-ori) | Contains an implementation of an organelle            |
|euglena            |[.eug](docs/file-type-eug) | Imports all components and creates an application     |

Suggested structure of the application is shown below. 

>simple-euglena-application 

>>src 

>>>particles

>>>chromosomes

>>>organelles

>>>organelle-impls

