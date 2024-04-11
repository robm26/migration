# Relational Database to DynamoDB Migration: Workshop Artifacts

Here you will find scripts, sample data sets, and application code, 
to accompany the Relational Database Migration Workshop hands-on instructions 
published at [catalog.workshops.aws](https://catalog.workshops.aws/)

## Overview

Developers are choosing to migrate relational database applications to DynamoDB 
to take advantage of DynamoDB's serverless scalable architecture, 
predictable low latency performance, and low maintenance. 

This project provides scripts and code for you to setup and run a migration from MySQL to DynamoDB.

## Pre-requisites
This migration is designed to be run during an AWS-sponsored event, 
where a starting environment is created and provided for you.
The starting environment includes an empty MySQL instance, an S3 bucket, and Cloud9 developer workstation 
for performing the workshop steps.

You can also setup and run the migration using your own laptop, AWS account, and your existing MySQL database.


## Components

This repository provides:

* Scripts to create source tables within a MySQL database
* Scripts to populate tables with seed data
* An [AWS Chalice](https://aws.github.io/chalice/faq.html) serverless stack definition:
  * API Gateway
  * AWS Lambda function (Python)
* Scripts to create target DynamoDB tables
* Scripts to migrate relational data to S3 and run a DynamoDB Import from S3
* A sample webapp that reads and writes to MySQL, and later DynamoDB

