# SSDK TOOLS HUB — Search Test & Benchmark Report

**Total Indexed Tools:** 967
**Search Quality Score:** 100.0% (22/22 test cases passed)

## Performance Latency Benchmarks (Measured over 100 Query Executions)

- **Average Latency:** `2.601 ms`
- **Fastest Query:** `1.171 ms`
- **99th Percentile Max:** `4.950 ms`

## Test Matrix Breakdown

| Test Type | Query | Top Result | Result Count | Latency | Status | Details |
|---|---|---|---|---|---|---|
| Exact | `"JSON Formatter"` | JSON Formatter | 92 | 11.315 ms | ✅ PASS | Found 'JSON Formatter' (#1) |
| Exact | `"PDF Merge"` | Merge PDF | 60 | 7.504 ms | ✅ PASS | Found 'Merge PDF' (#1) |
| Exact | `"Image Compressor"` | Image Compressor | 86 | 11.988 ms | ✅ PASS | Found 'Image Compressor' (#1) |
| Exact | `"Age Calculator"` | Age Calculator | 323 | 5.803 ms | ✅ PASS | Found 'Age Calculator' (#1) |
| Exact | `"Password Generator"` | Password Generator | 234 | 4.677 ms | ✅ PASS | Found 'Password Generator' (#1) |
| Partial | `"json"` | JSON Formatter | 92 | 2.580 ms | ✅ PASS | Top result 'JSON Formatter' is in category '🛠 Developer Tools' |
| Partial | `"pdf"` | PDF to JPG | 57 | 2.350 ms | ✅ PASS | Top result 'PDF to JPG' is in category '📄 PDF Tools' |
| Partial | `"image"` | Image Compressor | 80 | 1.798 ms | ✅ PASS | Top result 'Image Compressor' is in category '🖼 Image Tools' |
| Partial | `"qr"` | QR Code Generator | 149 | 0.996 ms | ✅ PASS | Found 'QR Code Generator' (#1) |
| Typo | `"imge compres"` | Image Compressor | 31 | 3.637 ms | ✅ PASS | Found 'Image Compressor' (#1) |
| Typo | `"calclator"` | Age Calculator | 169 | 2.831 ms | ✅ PASS | Found matching category results for typo query |
| Typo | `"pdf merg"` | Merge PDF | 60 | 3.252 ms | ✅ PASS | Found 'Merge PDF' (#1) |
| Typo | `"resizr"` | Image Resizer | 3 | 1.978 ms | ✅ PASS | Found 'Image Resizer' (#1) |
| Synonym | `"join pdf"` | Merge PDF | 60 | 2.730 ms | ✅ PASS | Found 'Merge PDF' (#1) |
| Synonym | `"combine pdf"` | Merge PDF | 60 | 3.339 ms | ✅ PASS | Found 'Merge PDF' (#1) |
| Synonym | `"reduce image size"` | Image Compressor | 98 | 5.892 ms | ✅ PASS | Found 'Image Compressor' (#1) |
| Synonym | `"remove bg"` | Background Remover | 24 | 2.926 ms | ✅ PASS | Found 'Background Remover' (#1) |
| Synonym | `"word count"` | Word Counter | 65 | 3.426 ms | ✅ PASS | Found 'Word Counter' (#1) |
| Multi-Word | `"compress jpg image"` | Image Compressor | 89 | 4.808 ms | ✅ PASS | Found 'Image Compressor' (#1) |
| Multi-Word | `"calculate compound interest"` | Compound Interest Calculator | 173 | 7.436 ms | ✅ PASS | Found 'Compound Interest Calculator' (#1) |
| Category-Aware | `"developer json"` | JSON Formatter | 140 | 3.891 ms | ✅ PASS | Top result 'JSON Formatter' is in category '🛠 Developer Tools' |
| Category-Aware | `"medical cbc"` | CBC Report Analyzer | 174 | 2.973 ms | ✅ PASS | Top result 'CBC Report Analyzer' is in category '🩺 Medical & Laboratory Tools' |
