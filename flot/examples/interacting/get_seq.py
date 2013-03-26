#!/usr/bin/env python

import getopt, sys

def main() :
    inputGen = ''
    begin = -1
    length = -1

    # input arguments
    try:
        opts, args = getopt.getopt(sys.argv[1:],"h:ibl",
                   ["help","input=","begin=","length="])
    except getopt.GetoptError or inputGen=='' or begin==-1 or length==-1:
        usage()
        sys.exit()
    for o, a in opts:
        if o in ("-h", "--help"):
            usage()
        if o in ("-i", "--input"):
            inputGen = str(a)
        if o in ("-b", "--begin"):
            begin = int(a)
        if o in ("-l", "--length"):
            length = int(a)

    if begin == -1 or length == -1 or inputGen == '':
        usage()
        sys.exit()

    # print "Using genome file: ["+inputGen+"]"
    genome = ''
    f = open(inputGen)
    filecontents = f.readlines()
    for line in filecontents:
        foo = line.strip('\n')
        if foo[0] != '>':
            foo = foo.replace('t', 'u')
            genome += foo


    print "Sequence starting at",begin,"and extending until",begin+length,"(ie length of",length,") is:"
    print genome[begin-1:begin+length-1]

def usage():

    print ' -------------------------------------------------------------------------'
    print ' Tool for getting subsequences, origin (first base) is 1 '
    print ' '
    print ' Typical usage:'
    print ' get_seq.py --input=16S.fa --begin=5 --length=4'
    print ' '
    print ' --input    Input genome file to read'
    print ' --begin    Beginning of sequence'
    print ' --length   The length of the genome for complete writing'
    print ' -------------------------------------------------------------------------'
    sys.exit(' ')

#-------------------------------
if __name__ == "__main__":
    main()
