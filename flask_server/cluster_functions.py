import pandas as pd
import Levenshtein as lv
from scipy.cluster.hierarchy import dendrogram, linkage
from scipy.spatial.distance import squareform
from scipy.cluster.hierarchy import to_tree
from functools import reduce
import json
import numpy as np

def calc_levenshtein_distance(gene_a, gene_b, gene_dict):
    dist = 1 - lv.ratio(gene_a, gene_b)
    return print('example dist {}'.format(list(gene_dict.keys())), dist)

def keep(s, indx_list):
    return ''.join(s[x] for x in range(len(s)) if x in indx_list)
    

def create_lv_matrix(sequences, nrs_keep):

    # s = 'ATAGCGGCTAAGCGGTTGTTACTG'
    # print('remove(s,2)', remove(s,[0,2]))
    print('nrs to keep for clustering: ', nrs_keep)

    # sequences = pd.read_csv('/Users/astrid/Desktop/CSV_db_pecto/13805694/sequences.csv')
    seqs = sequences[['mRNA_id','nuc_trimmed_seq']]
    seqs['new_seq'] = [keep(i,nrs_keep) for i in seqs['nuc_trimmed_seq']]
    nr_labels = len(sequences['mRNA_id'])

    # Create a zero matrix of w x h
    w, h = nr_labels, nr_labels
    matrix = [[0] * w for i in range(h)]

    # Fill your numbers in
    # go one row at a time and fill until you reach the diagonal
    print('calculating distances...')
    for i in range(nr_labels):
        # print("i", i)
        for j in range(0, i):
            # print("j", j)
            matrix[i][j] = matrix[j][i] =  1 - lv.ratio(seqs['new_seq'][i], seqs['new_seq'][j])
    print('calculating distances...DONE!')
    return matrix

def label_tree( n, id2name ):
    # If the node is a leaf, then we have its name
    if len(n["children"]) == 0:
        leafNames = [ id2name[n["node_id"]] ]

    # If not, flatten all the leaves in the node's subtree
    else:
        leafNames = reduce(lambda ls, c: ls + label_tree(c, id2name), n["children"], [])

    # Delete the node id since we don't need it anymore and
    # it makes for cleaner JSON
    del n["node_id"]

    # Labeling convention: "-"-separated leaf names
    n["name"] = name = "-".join(sorted(map(str, leafNames)))

    # print('leafnames', leafNames)
    return leafNames

def add_node(node, parent ):
        # First create the new node and append it to its parent's children
        newNode = dict( node_id=node.id, children=[] )
        parent["children"].append( newNode )

        # Recursively add the current node's children
        if node.left: add_node( node.left, newNode )
        if node.right: add_node( node.right, newNode )

def create_linkage_matrix(data_matrix, save_file=False):

    print('creating linkage matrix...')

    dists = squareform(data_matrix)
   
    # https://towardsdatascience.com/introduction-hierarchical-clustering-d3066c6b560e
    # https://www.cs.rice.edu/~ogilvie/comp571/2018/11/01/neighbor-joining.html
    # https://medium.com/geekculture/phylogenetic-trees-implement-in-python-3f9df96c0c32
    
    linkage_matrix = linkage(dists, "average") # complete / average (UPGMA) / single / weighted / median / ward ??
    if save_file == True:
        np.save('linkage_matrix.npy', linkage_matrix)

    print('creating linkage matrix...DONE!')

    return linkage_matrix


def create_d3_dendrogram(linkage_matrix, data_labels):

    print('creating d3dendro...')

    T = to_tree( linkage_matrix , rd=False )
    d3Dendro = dict(children=[], name="Root1")
    add_node( T, d3Dendro )

    id2name_dict = dict(enumerate(data_labels))
    label_tree( d3Dendro["children"][0] , id2name_dict)

    print('creating d3dendro...DONE!')

    # json.dump(d3Dendro, open("/Users/astrid/Desktop/d3-dendrogram_ADAPTED_50.json", "w"), sort_keys=True, indent=4)
    return d3Dendro
