import os

def consolidate_py_files():
    # Get the directory where THIS script is located
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_filename = os.path.join(current_dir, "Codes.txt")
    
    # Get all .py files in that specific folder
    files = [f for f in os.listdir(current_dir) 
             if f.endswith('.py') 
             and f != "Codes.txt" 
             and f != os.path.basename(__file__)]
    
    if not files:
        print(f"No other .py files found in: {current_dir}")
        return

    with open(output_filename, 'w', encoding='utf-8') as outfile:
        for filename in files:
            file_path = os.path.join(current_dir, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as infile:
                    content = infile.read()
                    
                    outfile.write("# ------------------------------------\n")
                    outfile.write(f"# {filename}\n")
                    outfile.write("# ------------------------------------\n\n")
                    outfile.write(content)
                    outfile.write("\n\n# End of File --------------------------\n\n")
                    
                print(f"Added: {filename}")
            except Exception as e:
                print(f"Error reading {filename}: {e}")

if __name__ == "__main__":
    consolidate_py_files()
    print("\nCheck the 'models' folder for Codes.txt!")