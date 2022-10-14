Instead of calling genes a function and getting the result into another gene. 

Bad approach
--------------------------------------

    call sequance 1-2-1

gene-something

    do something
    returnValue = gene-check-authenticate()
    do something with returnValue
    return something

gene-check-authenticate

    check authenticate
    return value


Good approach
--------------------------------------

    call sequence 1-2

gene-check-authenticate

    check authenticate
    return gene-something()

gene-something
    do something
    return something