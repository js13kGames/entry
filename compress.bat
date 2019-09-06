@ECHO OFF
java -jar .\closure.jar --assume_function_wrapper -W QUIET --jscomp_off undefinedVars --js main.js --js_output_file compiled.js --compilation_level ADVANCED_OPTIMIZATIONS --use_types_for_optimization --language_out ECMASCRIPT_2018
type index_template.html compiled.js index_end.html > index1.html