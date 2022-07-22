from flask import Flask, jsonify
from flask import request
from flask_cors import CORS
import os
import json
from datetime import datetime
import cluster_functions
import pandas as pd
from numpy import load
import tanglegram as tg


# Source: https://testdriven.io/blog/developing-a-single-page-app-with-flask-and-vuejs/


# configuration
DEBUG = True

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})
api_path = '/Users/astrid/Desktop/db_preprocessed/db_pecto'
db_path = '/Users/astrid/Desktop/CSV_db_arabid_small_copy'



# print('test df')
# print(data_pecto.phenos.head())
# print(data_pecto.phenos.head().to_csv(index=False))
# print(data_pecto.al_pos.head().to_csv(index=False))
# print(data_pecto.sequence_info.head())
# seq_info = len(data_pecto.sequence_info['mRNA_id'].unique())
# print('unique mRna', seq_info)

# heatmap_data_test = data_pecto.al_pos[data_pecto.al_pos['position']<500]
# print('heatmap_data_test', heatmap_data_test)
# pos_info = len(heatmap_data_test['position'].unique())
# print('unique positions', pos_info)
# print('nr genes', len(data_pecto.sequence_ info[data_pecto.sequence_info['gene/mRNA_name']]))

#example levenshtein dist from two equal length nt strings 
# gene_dict = {}
# gene_dict['GPNGIIIH_02659_mRNA'] = 'ATAGCGGCTAAGCGGTTGTTACTGATTCCGCTTTGCCTGCTGGCTATCGGCTTAACCAATCTCATTTGGTATCACCACTATTATCAACCCGATAGCCTGTTACCTTATGTGTATAACGCCTACAGGACATCCGCGCATGCCGGTATTCTGGGGGCATTCATCCTGCTGACAGCCCTGCATATCGCGCAAAAAAATCGG---CAACAGCCACTCTTATACATCATCGCAATCTGTGTTCTCACGCTAGGCTACGCGTTCTATCAGTCATTATTCAGCGGCATGCACCGTATTGGATTAGTATTTGGTACCGCAACGAGCGCGGCCTATTTTCTTACCTTCATCGGTGCCTTAAGCGCACAGGCGCTGCTTAAGCTCGATTC---------AACCTATAAGTATTATCTCTATCTGGGGCATTTCCTGTTAGTGACTGTCGCTATTCTGCTGACAGAAACCCGGGCGGCCATCTTCGTCTATCCTATTGTTGGCGCAACCATTTTATTGTCAGAAGTCAGGCACAGTAAGCCGCTATTTATAAAAGCATTAGTCGGCTCATCGGCCACGCTGCTTCTGTGTTTATTCCTTTTCCAGGAAACGATTCATCAGCGTGTTAACGATCTGATTAATGACGTCCACAGCTATAGCATGAATAACAGCAGAACCTCGGTTGGTGCGCGAATCGCGATGTACCAATCGGGTATCGAAGCAGGGGAAGACGCATTATTGGGGCAGTCTGCCGAACAGCGCGCAGAGCGAATCGTTGCACAAGCAGAACAAAAGCCGAACTTAGCGGGTGCCGTTGAATTCTTGAATGTCCATCTGCATAACGAAGTGATTGATGCCTTTTCCCTTAAGGGGTTGCCGGGCGCAATATTGCTTGTGTTGCTCTATGCCGCTTTATTTTATTTTTCATTTTTTGTTCTACGCAGCCACCTCTCTGCTGCGCTACTTTTTGCCCTGCTGATGTATGGACTTAGCGATGTCATTCTCTATTCACGAGACATGCTTATCGCGTGGCTGATGGCGTTTTGCCTCGGCACAACGCTGACCGGAAAATGGCTAAAGAATTAG'
# gene_dict['HPCCBOLC_00315_mRNA'] = 'ATAGCGGCTAAGCGGCTGTTACTGATTCCACTTTGCCTGCTGACTATCGGCTTAACCAATCTCATTTGGTATCACCACTATTATCAACCCGATAGCCTTTTACCTTATGTGTATAACGCCTACAGGACATCCGCCCATGCTGGTATTCTGGGTGCCTTTACCCTGCTAACGGTCTTGCATCTTTCACAAAGGAGTCAGCTACAACGGTTACATACCTATATGCTCGTCATTTGTGTGCTAGCGTTAGGCTATGCATTTTATCAGGCATGGTTCAGTGGAATGCATCGCATTGGGCTGGTATTTGGCACGGCCACTAGCGCAGCCTATTTTCTGACGTTCATCGGCGCCTTAAGCGCACAGGCACTGCTTAAGCTCGATTC---------AACCTATAAGTATTATCTCTATCTGGGGCATTTTCTGTTAGTGATGGTGGCTATTTTGCTAACAGAGACGCGGGCAGCGATATTCGTCTACCCGATTGTCGGCGCGACCATTTTATTGTCAGAAGTCAGGCATAATAAACGCCTGCTTATTAAAGCATTCGTCGGTTCATCGGCCACGCTTCTCCTGTGTTTATTCCTCTTCCAGAATACGCTTTATCAACGTGTCAACGACCTGATCAACGATATACACAGCTATAGTATGGACAACAGCATGACCTCGGTGGGTGCGCGTATTGCGATGTACCAATCAGGTATAGAGGCAGGAGAAGAAGCCCTGTTCGGACAATCTGCCGAGCAGCGTGCAGAGCGAATCGTTGCACAAGCAAAGCAAGAGTCTGAATTATCAGGCGCGTTGGGATATTTGAATGTCCATCTGCATAACGACGTGATTGATGCCTTCTCCCTTAAGGGATTACCGGGAGCAATATTGCTTGTGTTGCTCTATGCCTCCCTATTTTATTTTTCGTTTTTTGTTCTACGCAGCCACCTCTCTGCTGCGCTGCTTTTTGCCTTGCTGATGTATGGACTTAGCGATGTCATTCTCTATTCACGAGACATGCTGATTGCGTGGCTGATGGCGTTTTGTCTTGGCACAACGCTGACTGGAAAATGGTTAAAGCAGAAA'

# print('sequences', data_pecto.sequences[['mRNA_id','nuc_trimmed_seq']].head())


# # sanity check route
# @app.route('/ping', methods=['GET'])
# def ping_pong():
#     cluster_functions.calc_levenshtein_distance(gene_dict['GPNGIIIH_02659_mRNA'], gene_dict['HPCCBOLC_00315_mRNA'], gene_dict)
#     # return jsonify(datetime.today().strftime('%Y-%m-%d-%H:%M:%S'))
#     return data_pecto.al_pos.head().to_csv(index=False)


####################
#### NEW ROUTES ####
####################

# homology ID route
@app.route('/homology_ids', methods=['GET'])
def homology_ids():    
    json_url = os.path.join(db_path, "data_homology_ids.json")
    data = json.load(open(json_url))
    return jsonify(data)

# get aligned positions from pecto db 
@app.route('/<id>/al_pos/<slice>', methods=['GET'])
def all_pos_new(id, slice):    
    al_pos = pd.read_csv(os.path.join(db_path, id, 'al_pos.csv'))
    start = int(slice.split('-')[0])
    end = int(slice.split('-')[1])
    al_pos_small = al_pos[(start < al_pos['position']) & (al_pos['position'] < end)]
    # al_pos_small = al_pos
    return al_pos_small.to_csv(index=False)

# get aligned positions from pecto db 
@app.route('/<id>/al_pos', methods=['GET'])
def all_pos(id):    
    al_pos = pd.read_csv(os.path.join(db_path, id, 'al_pos.csv'))
    al_pos_small = al_pos
    return al_pos_small.to_csv(index=False)

# get sequences from pecto db 
@app.route('/<id>/sequences', methods=['GET'])
def sequences(id):    
    seqs = pd.read_csv(os.path.join(db_path, id, 'sequences.csv'))
    return seqs.to_csv(index=False)


# get sequences from pecto db 
@app.route('/<id>/phenos', methods=['GET'])
def phenos(id):    
    # phenos = pd.read_csv(os.path.join(db_path, id, 'phenos.csv'))
    # seq_info = pd.read_csv(os.path.join(db_path, id, 'sequence_info.csv'))
    # result = pd.merge(phenos, seq_info, on=["genome_nr"]) # to get mrna-id
    result = pd.read_csv(os.path.join(db_path, id, 'phenos.csv')) # important !!

    return result.to_csv(index=False)

# get sequences from pecto db 
@app.route('/<id>/var_pos_count', methods=['GET'])
def var_pos_count(id):    
    var_pos_count = pd.read_csv(os.path.join(db_path, id, 'var_pos_count.csv'))
    max_values = []
    # create new col for score
    for index, row in var_pos_count.iterrows():
        nrs = []
        nrs.extend([row['A'], row['C'], row['T'], row['G'], row['gap']])
        max = 0
        for i in nrs:
            if i > max:
                max= i
        max_values.append(max)
    var_pos_count['conservation'] = [i for i in max_values]
    return var_pos_count.to_csv(index=False)

# get sequences from pecto db 
@app.route('/<id>/nuc_structure', methods=['GET'])
def nuc_structure(id):    
    nuc_struct = pd.read_csv(os.path.join(db_path, id, 'nuc_structure.csv'))

    return nuc_struct.to_csv(index=False)

# @app.route('/<id>/d3dendro', methods=['GET', 'POST'])
@app.route('/<id>/d3dendro', methods=['GET', 'POST'])
def get_d3_dendro_new(id):

    data_sequences = pd.read_csv(os.path.join(db_path, id, 'sequences.csv'))
    data_labels = data_sequences['mRNA_id'].to_list()

    print('test')

    if request.method == 'POST':
        print('hello from POST method --> interactive dendrogram')
        print('response: ', request.json['selected_items'])
        
        numbers_to_remove = request.json['selected_items']
        numbers_to_remove = [int(i) for i in numbers_to_remove]

        
        data_matrix = cluster_functions.create_lv_matrix(data_sequences, numbers_to_remove)
        
        linkage_matrix= cluster_functions.create_linkage_matrix(data_matrix, save_file=False)

        linkage_matrix_new = cluster_functions.create_linkage_matrix(data_matrix, save_file=False)
        linkage_matrix_all = load('linkage_matrix.npy')
       
        ## get untangled matrix
        untangled = tg.untangle(linkage_matrix_new, linkage_matrix_all, data_labels, data_labels, method="step1side")


        linkage_matrix = untangled[0]
        d3_dendro = cluster_functions.create_d3_dendrogram(linkage_matrix, data_labels)

        return d3_dendro
    
    else:
        print('hello from GET method --> original dendrogram')
        data_matrix = cluster_functions.create_lv_matrix(data_sequences, list(range(1,len(data_sequences['nuc_trimmed_seq'][0])+1))) #remove none by default list(range(500))
        linkage_matrix = cluster_functions.create_linkage_matrix(data_matrix, save_file=True)
        
        d3_dendro = cluster_functions.create_d3_dendrogram(linkage_matrix, data_labels)

        
        return d3_dendro

####################


# # al positions test (0-34)
# @app.route('/al_pos', methods=['GET'])
# def all_pos():    
#     # return heatmap_data_test.to_csv(index=False)
#     return data_pecto.al_pos.to_csv(index=False)

# @app.route('/d3dendro', methods=['POST'])
# def get_d3_dendro_params():
#     print('respose: ', request.json['selected_items'])
#     print('hello from post method')

#     return 'OK'

# # route to get adapted cluster dendrogram
# @app.route('/d3dendro', methods=['GET', 'POST'])
# def get_d3_dendro():

#     if request.json:
#         print('data POST request received')

#     # if request.method == 'POST':
#         print('hello from POST method')
#         print('response: ', request.json['selected_items'])
#         numbers_to_remove = request.json['selected_items']
#         numbers_to_remove = [int(i) for i in numbers_to_remove]

#         test_matrix = cluster_functions.create_lv_matrix(data_pecto.sequences, numbers_to_remove)
#         # print('test matrix',test_matrix)
#         test_labels = data_pecto.sequences['mRNA_id'].to_list()
#         d3_dendro = cluster_functions.create_d3_dendrogram(test_matrix, test_labels)

#         return d3_dendro
    
#     else:
#         print('hello from GET method')
#         test_matrix = cluster_functions.create_lv_matrix(data_pecto.sequences, list(range(1,len(data_pecto.sequences['nuc_trimmed_seq'][0])+1))) #remove none by default list(range(500))
#         # print('test matrix',test_matrix)
#         test_labels = data_pecto.sequences['mRNA_id'].to_list()
#         d3_dendro = cluster_functions.create_d3_dendrogram(test_matrix, test_labels)
#         # print('test dendro', d3_dendro)
#         return d3_dendro



@app.route('/tree_nuc_trimmed', methods=['GET'])
def trees():    
    data = json.load(open('/Users/astrid/Desktop/CSV_db_pecto/13805694/trees.json'))
    data_nuc_trimmed = data['nuc_trimmed']
    return jsonify(data_nuc_trimmed)


# @app.route('/<id>')
# def homology(id):
#     json_url = os.path.join(api_path, "{}.json".format(id))
#     print('url', json_url)
#     with open(json_url, 'r') as f:
#       fileData = json.load(f)
#       f.close()
#     # print('url json', fileData)
#     # response = response.headers.add('Access-Control-Allow-Origin', '*')
#     return jsonify(fileData)

@app.route('/<id>')
def homology(id):
    json_url = os.path.join(api_path, "{}.json".format(id))
    print('url', json_url)
    with open(json_url, 'r') as f:
      fileData = json.load(f)
      f.close()
    # print('url json', fileData)
    # response = response.headers.add('Access-Control-Allow-Origin', '*')
    return jsonify(fileData)



# Airplay sharing port 5000 disabled 
# https://developer.apple.com/forums/thread/693768
if __name__ == '__main__':
    app.run(host = 'localhost' , port = 5000) 