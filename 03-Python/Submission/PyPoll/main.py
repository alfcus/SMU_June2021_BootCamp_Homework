import os
import csv

csvpath = "PyPoll\\Resources\\election_data.csv"

with open(csvpath) as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')
    csv_header = next(csvreader)
    all_rows = []

    for row in csvreader:
        all_rows.append(row)

# Initializing dictionary to count votes for each canidate
canidateVotes = {}
for row in all_rows:
    if row[2] not in canidateVotes:
        canidateVotes[row[2]]= 1
    else:
        canidateVotes[row[2]] += 1

# Storing total vote count which is based on row count
totalVotes = len(all_rows)

# Percentage calculations to be used in summary table
canKhanPerc = 100 * canidateVotes['Khan']/totalVotes
canCorreyPerc = 100 * canidateVotes['Correy']/totalVotes
canLiPerc = 100 * canidateVotes['Li']/totalVotes
canOtooleyPerc = 100 * canidateVotes["O'Tooley"]/totalVotes
nameOtooley = "O'Tooley"

# Summary table
print(f"Election Results")
print(f"-------------------------")
print(f"Total Votes: {totalVotes}")
print(f"-------------------------")
print(f"Kahn: {canKhanPerc:.3f}% ({canidateVotes['Khan']})")
print(f"Correy: {canCorreyPerc:.3f}% ({canidateVotes['Correy']})")
print(f"Li: {canLiPerc:.3f}% ({canidateVotes['Li']})")
print(f"O'Tooley: {canOtooleyPerc:.3f}% ({canidateVotes[nameOtooley]})")
print(f"-------------------------")
print(f"Winner: {max(canidateVotes, key=canidateVotes.get)}")
print(f"-------------------------")

# write to TXT file
out_path = "PyPoll\\Analysis\\pypoll.txt"
with open(out_path, "w") as f:
    f.write(f"Election Results\n")
    f.write(f"-------------------------\n")
    f.write(f"Total Votes: {totalVotes}\n")
    f.write(f"-------------------------\n")
    f.write(f"Kahn: {canKhanPerc:.3f}% ({canidateVotes['Khan']})\n")
    f.write(f"Correy: {canCorreyPerc:.3f}% ({canidateVotes['Correy']})\n")
    f.write(f"Li: {canLiPerc:.3f}% ({canidateVotes['Li']})\n")
    f.write(f"O'Tooley: {canOtooleyPerc:.3f}% ({canidateVotes[nameOtooley]})\n")
    f.write(f"-------------------------\n")
    f.write(f"Winner: {max(canidateVotes, key=canidateVotes.get)}\n")
    f.write(f"-------------------------")
