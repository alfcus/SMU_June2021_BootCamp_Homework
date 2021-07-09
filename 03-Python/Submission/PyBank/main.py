# Modules
import os
import csv

csvpath = "PyBank\\Resources\\budget_data.csv"

# read in the CSV data into memory - a list of lists
with open(csvpath) as csvfile:

    # CSV reader specifies delimiter and variable that holds contents
    csvreader = csv.reader(csvfile, delimiter=',')

    # Read the header row first (skip this step if there is now header)
    csv_header = next(csvreader)
    # print(f"CSV Header: {csv_header}")

    # store all my rows as a list of lists
    all_rows = []
    for row in csvreader:
        # clean rows and cast the second column to an integer
        temp_row = row
        temp_row[1] = int(temp_row[1])

        all_rows.append(temp_row)

# Storing total month count which is based on row count
totMon = len(all_rows)

# Create profit list to gather profit total
tempProfit = [x[1] for x in all_rows]
totProfit = sum(tempProfit)

# Look-ahead method to find changes in profit
deltaProfit = []
for i in range(len(all_rows) - 1):
    currentProfit = all_rows[i][1]
    nextProfit = all_rows[i + 1][1]

    change = nextProfit - currentProfit
    deltaProfit.append(change)

# Avergae changes
avgChg = sum(deltaProfit)/len(deltaProfit)
maxChg = max(deltaProfit)
minChg = min(deltaProfit)

# Change indexes
maxChgInd = deltaProfit.index(maxChg) + 1
maxMon = all_rows[maxChgInd][0]
minChgInd = deltaProfit.index(minChg) + 1
minMon = all_rows[minChgInd][0]

print(f"Financial Analysis")
print(f"----------------------------")
print(f"Total Months: {totMon}")
print(f"Total: ${totProfit}")
print(f"Average Change: ${round(avgChg, 2)}")
print(f"Greatest Increase in Profits: {maxMon} (${maxChg})")
print(f"Greatest Decrease in Profits: {minMon} (${minChg})")

# write to TXT file
out_path = "PyBank\\Analysis\\pybank.txt"
with open(out_path, "w") as f:
    f.write(f"Financial Analysis\n")
    f.write(f"----------------------------\n")
    f.write(f"Total Months: {totMon}\n")
    f.write(f"Total: ${totProfit}\n")
    f.write(f"Average Change: ${round(avgChg, 2)}\n")
    f.write(f"Greatest Increase in Profits: {maxMon} (${maxChg})\n")
    f.write(f"Greatest Decrease in Profits: {minMon} (${minChg})")
