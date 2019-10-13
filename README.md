# CSE110Project

## Introduction

Class Constructor is an online tool made for UCSD students that allows the users to create an edit academic schedules, view course details, track academic progress, and generate possible future quarters. 

## Login Credentials
Account with pre-populated data:
```
Username : cse110classconstructor@gmail.com
Password : Gillespie110!
```
Clean account with no data :

```
Username : classconstructortester01@gmail.com
Password : Gillespie110!
```
## Requirments
The application should be run on Chrome or Firefox

## Installation Instruction
Access http://classconstructor.com

## How to Run
Access http://classconstructor.com

## Know Bugs
### Issue 1
1. Client-side crash will occur if using chrome and:

    a. Navigate to academic history page
    
    b. Select upload Academic History
    
    c. Choose file
    
    d. Select any file
    
    e. Confirm/open in file explorer
    
    f. Choose file
    
    g. Click cancel

Fix: 

   a. Close tab

   b. Access ClassConstructor.com
    
### Issue 2 
2. Delete account does not consistently work, as it may require 1-3 attempts to actually delete data. You have to:

    a. Delete account 
    
    b. Confirm
    
    c. Login
    
    d. Delete account
    
    e. Confirm
    
    f. The account will now be deleted (might required one more pass through the delete account cycle)

